import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';

const PIN = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">
  <defs><filter id="s" x="-60%" y="-60%" width="220%" height="220%">
    <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".3"/></filter></defs>
  <path filter="url(#s)" d="M15 2C8.9 2 4 6.9 4 13c0 8 11 21 11 21s11-13 11-21C26 6.9 21.1 2 15 2z" fill="#0071e3"/>
  <circle cx="15" cy="13" r="4.4" fill="#fff"/>
</svg>`)}`;

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const wrapPi = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };

/**
 * Duenne Huelle um Photo Sphere Viewer mit allem, was das Studio braucht:
 * Szenenwechsel, Hotspot-Marker, Logo-/Stativ-Patch und eine per Keyframes
 * gesteuerte Kamerafahrt.
 */
export class PanoViewer {
  constructor(container) {
    this.viewer = new Viewer({
      container,
      navbar: ['zoom', 'move', 'fullscreen'],
      defaultZoomLvl: 40,
      mousewheelCtrlKey: false,
      loadingTxt: 'Panorama wird geladen…',
      plugins: [
        MarkersPlugin,
        [AutorotatePlugin, { autostartDelay: null, autostartOnIdle: false, autorotateSpeed: '1rpm' }],
      ],
    });
    this.markers = this.viewer.getPlugin(MarkersPlugin);
    this.autorotate = this.viewer.getPlugin(AutorotatePlugin);
    this._clickCb = null;
    this._hotspotCb = null;
    this._playing = false;

    this.viewer.addEventListener('click', ({ data }) => {
      if (this._clickCb && !data.rightclick) this._clickCb({ yaw: data.yaw, pitch: data.pitch });
    });
    this.markers.addEventListener('select-marker', ({ marker }) => {
      if (marker?.data?.type === 'hotspot' && this._hotspotCb) this._hotspotCb(marker.data);
    });
  }

  onClick(cb) { this._clickCb = cb; }
  onHotspot(cb) { this._hotspotCb = cb; }

  getView() {
    const p = this.viewer.getPosition();
    return { yaw: p.yaw, pitch: p.pitch, zoom: this.viewer.getZoomLevel() };
  }

  async loadScene(scene, { navigable = true } = {}) {
    await this.viewer.setPanorama(scene.image_path, {
      position: { yaw: scene.default_yaw || 0, pitch: scene.default_pitch || 0 },
      zoom: scene.default_zoom ?? 50,
      transition: true,
      showLoader: true,
    });
    this.renderMarkers(scene, { navigable });
  }

  renderMarkers(scene, { navigable = true } = {}) {
    this.markers.clearMarkers();
    // Hotspots (Wege zu anderen Szenen)
    for (const h of scene.hotspots || []) {
      try {
        this.markers.addMarker({
          id: `hs-${h.id}`,
          position: { yaw: h.yaw, pitch: h.pitch },
          image: PIN,
          size: { width: 30, height: 38 },
          anchor: 'bottom center',
          className: 'psv-marker--pano',
          tooltip: h.label || 'Weiter',
          data: { type: 'hotspot', ...h },
        });
      } catch (e) { console.warn('Hotspot-Marker fehlgeschlagen', e); }
    }
    // Logo- / Stativ-Patch (flach am Boden liegend)
    this.renderLogo(scene);
  }

  _hasMarker(id) { try { return this.markers.getMarkers().some((m) => m.id === id); } catch { return false; } }

  // Flaches Viereck (4 Eckpunkte) rund um einen Kugelpunkt — legt das Logo
  // wie einen Teppich auf den Boden und ueberdeckt so Stativ/Fotograf.
  _patchQuad(yawC, pitchC, halfDeg) {
    const h = Math.min((halfDeg * Math.PI) / 180, 1.2);
    const t = Math.tan(h);
    const cp = Math.cos(pitchC), sp = Math.sin(pitchC), cy = Math.cos(yawC), sy = Math.sin(yawC);
    const C = { x: cp * sy, y: sp, z: cp * cy };
    const east = { x: cy, y: 0, z: -sy };                 // Tangente d/dyaw (normiert)
    const north = { x: -sp * sy, y: cp, z: -sp * cy };    // Tangente d/dpitch (normiert)
    const toYP = (v) => {
      const n = Math.hypot(v.x, v.y, v.z);
      return { yaw: Math.atan2(v.x / n, v.z / n), pitch: Math.asin(Math.max(-1, Math.min(1, v.y / n))) };
    };
    const corner = (a, b) => toYP({
      x: C.x + a * t * east.x + b * t * north.x,
      y: C.y + a * t * east.y + b * t * north.y,
      z: C.z + a * t * east.z + b * t * north.z,
    });
    return [corner(-1, -1), corner(-1, 1), corner(1, 1), corner(1, -1)];
  }

  renderLogo(scene) {
    if (this._hasMarker('logo')) this.markers.removeMarker('logo', false);
    if (!scene.logo_enabled || !scene._logo_url) return;
    try {
      this.markers.addMarker({
        id: 'logo',
        imageLayer: scene._logo_url,
        position: this._patchQuad(scene.logo_yaw || 0, scene.logo_pitch ?? -Math.PI / 2, scene.logo_scale || 22),
        opacity: 1,
      });
    } catch (e) { console.warn('Logo-Patch fehlgeschlagen', e); }
  }

  setAutorotate(on) {
    try { on ? this.autorotate.start() : this.autorotate.stop(); } catch { /* Plugin evtl. nicht bereit */ }
  }

  // -------------------------------------------------------- Kamerafahrt ----
  stopPath() { this._playing = false; }

  async playPath(keyframes, { onStep } = {}) {
    if (!keyframes?.length) return;
    this.setAutorotate(false);
    this._playing = true;
    let from = this.getView();
    // Erst sanft zum ersten Punkt
    const frames = [...keyframes];
    for (let i = 0; i < frames.length && this._playing; i++) {
      const to = frames[i];
      await this._tween(from, to, to.duration || 2500);
      onStep?.(i);
      from = { yaw: to.yaw, pitch: to.pitch, zoom: to.zoom ?? 50 };
    }
    this._playing = false;
  }

  _tween(from, to, duration) {
    return new Promise((resolve) => {
      const dYaw = wrapPi(to.yaw - from.yaw);
      const dPitch = (to.pitch ?? from.pitch) - from.pitch;
      const z0 = from.zoom ?? 50, dZoom = (to.zoom ?? 50) - z0;
      const t0 = performance.now();
      const step = (now) => {
        if (!this._playing) return resolve();
        const t = Math.min(1, (now - t0) / duration);
        const e = easeInOut(t);
        this.viewer.rotate({ yaw: from.yaw + dYaw * e, pitch: from.pitch + dPitch * e });
        this.viewer.zoom(z0 + dZoom * e);
        if (t < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  rotateTo(view, duration = 900) {
    this._playing = true;
    return this._tween(this.getView(), view, duration).then(() => { this._playing = false; });
  }

  // Temporaere Vorschau-Marker fuer die Kamerafahrt-Punkte
  showPathPreview(keyframes) {
    this.markers.getMarkers().filter((m) => m.id.startsWith('kf-'))
      .forEach((m) => this.markers.removeMarker(m.id, false));
    keyframes.forEach((k, i) => {
      this.markers.addMarker({
        id: `kf-${i}`, position: { yaw: k.yaw, pitch: k.pitch },
        html: `<div style="width:24px;height:24px;border-radius:50%;background:#fff;
          border:2px solid #0071e3;color:#0071e3;font:600 12px -apple-system,sans-serif;display:grid;
          place-items:center;box-shadow:0 1px 5px rgba(0,0,0,.25)">${i + 1}</div>`,
        anchor: 'center center', tooltip: `Punkt ${i + 1}`,
      });
    });
  }
  clearPathPreview() {
    this.markers.getMarkers().filter((m) => m.id.startsWith('kf-'))
      .forEach((m) => this.markers.removeMarker(m.id, false));
  }

  destroy() { this.viewer.destroy(); }
}
