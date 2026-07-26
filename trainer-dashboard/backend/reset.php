<?php
/**
 * ETAF — Passwort festlegen / zurücksetzen (zweistufig, scanner-sicher)
 * ---------------------------------------------------------------
 * GET  reset.php?token=<tok>  → zeigt NUR das Formular. Ändert nichts.
 *      (E-Mail-Scanner rufen nur GET auf → der Link wird nicht „verbraucht“.)
 * POST → setzt das Passwort und entwertet den Link.
 * ---------------------------------------------------------------
 */
require_once __DIR__.'/lib.php';
require_once __DIR__.'/mailer.php';
ensure_schema();

$isCommit = ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST';
$tok  = $_POST['token'] ?? $_GET['token'] ?? '';
$p1   = (string)($_POST['pw1'] ?? '');
$p2   = (string)($_POST['pw2'] ?? '');

$row = $tok ? q("SELECT r.*, u.email, u.name FROM reset_tokens r
  JOIN users u ON u.id=r.user_id WHERE r.tok=?",[$tok])->fetch() : null;

/* Gültigkeit: nicht benutzt und nicht älter als RESET_TTL_MIN Minuten */
$valid = false;
if($row && empty($row['used_at']) && !empty($row['created_at'])){
  $valid = (time() - ts($row['created_at'])) <= RESET_TTL_MIN*60;
}
$invite = ($row['purpose'] ?? 'reset') === 'invite';

$done=false; $err='';
if($isCommit && $valid){
  if(strlen($p1) < 8)      $err='Bitte mindestens 8 Zeichen verwenden.';
  elseif($p1 !== $p2)      $err='Die beiden Eingaben stimmen nicht überein.';
  else {
    q("UPDATE users SET pass_hash=?, active=1 WHERE id=?",
      [password_hash($p1, PASSWORD_DEFAULT), $row['user_id']]);
    q("UPDATE reset_tokens SET used_at=? WHERE tok=?",[now(),$tok]);
    // Alle bestehenden Sitzungen dieses Kontos beenden (Sicherheit)
    q("DELETE FROM sessions WHERE user_id=?",[$row['user_id']]);
    audit_as(['id'=>$row['user_id'],'name'=>$row['name']], $invite?'password.set':'password.reset',
             'user', (string)$row['user_id'], 'Passwort über Link gesetzt');
    $done=true;
  }
}
function esc($s){ return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
$action = esc(base_url().'/reset.php');
$etok   = esc($tok);
?>
<!doctype html><html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ETAF — Passwort</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:auto;
    background:#f4f5f6;box-sizing:border-box;
    padding:calc(20px + env(safe-area-inset-top,0px)) 16px calc(20px + env(safe-area-inset-bottom,0px));
    font:16px/1.6 system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#242b31}
  .card{width:min(420px,100%);margin:auto;background:#fff;border:1px solid #e2e5e8;border-radius:16px;
    box-shadow:0 10px 30px -14px rgba(35,43,49,.25);padding:32px 28px;box-sizing:border-box}
  .logo{font-weight:800;font-size:30px;letter-spacing:-.05em;color:#3e4852}.logo span{color:#d81f26}
  h1{font-size:19px;margin:14px 0 6px}.sub{color:#8a939a;margin:0 0 18px;font-size:14px}
  label{display:block;font-size:12px;font-weight:700;color:#5c666e;text-transform:uppercase;
    letter-spacing:.05em;margin:14px 0 6px}
  input{width:100%;box-sizing:border-box;padding:12px 13px;border:1px solid #e2e5e8;border-radius:9px;
    font:16px system-ui,Arial,sans-serif;background:#f8f9fa;color:#242b31}
  input:focus{outline:2px solid #3e4852;outline-offset:-1px}
  button{display:block;width:100%;margin-top:18px;padding:15px 18px;border-radius:10px;cursor:pointer;
    font:700 16px system-ui,Arial,sans-serif;background:#3E4852;color:#fff;border:2px solid #3E4852}
  .hint{margin-top:14px;font-size:12.5px;color:#8a939a}
  .err{background:#fdeaea;border:1px solid #f2c2c2;color:#B21620;border-radius:10px;
    padding:11px 14px;margin:14px 0 0;font-size:14px}
  .done{background:#e9f6ef;border:1px solid #bfe3cf;color:#1E7A4D;border-radius:12px;
    padding:16px 18px;margin-top:6px;font-size:15px}
  .foot{margin-top:18px;font-size:12px;color:#8a939a}
  @media (prefers-color-scheme:dark){
    body{background:#12171c;color:#e9edf0}.card{background:#1a2127;border-color:#28323a}
    .logo{color:#aeb9c2}.sub,.foot,.hint{color:#6e7a82}
    input{background:#12171c;border-color:#28323a;color:#e9edf0}
  }
</style></head><body>
  <div class="card">
    <div class="logo">ETAF<span>.</span></div>
    <?php if(!$row || !$valid): ?>
      <h1>Dieser Link ist ungültig oder abgelaufen.</h1>
      <p class="sub">Links sind <?=RESET_TTL_MIN?> Minuten gültig und können nur einmal verwendet werden.
        Fordere im Login einfach einen neuen an.</p>
    <?php elseif($done): ?>
      <div class="done"><?=stroke_icon('check',18)?><b>Passwort gespeichert.</b><br>
        Du kannst dich jetzt mit <?=esc($row['email'])?> anmelden.</div>
      <p class="hint">Diese Seite kannst du nun schließen.</p>
    <?php else: ?>
      <h1><?= $invite ? 'Willkommen — Passwort festlegen' : 'Neues Passwort vergeben' ?></h1>
      <p class="sub">Für <b><?=esc($row['email'])?></b></p>
      <?php if($err): ?><div class="err"><?=esc($err)?></div><?php endif; ?>
      <form method="post" action="<?=$action?>">
        <input type="hidden" name="token" value="<?=$etok?>">
        <label for="pw1">Neues Passwort (mind. 8 Zeichen)</label>
        <input id="pw1" type="password" name="pw1" autocomplete="new-password" required minlength="8">
        <label for="pw2">Passwort wiederholen</label>
        <input id="pw2" type="password" name="pw2" autocomplete="new-password" required minlength="8">
        <button type="submit"><?=stroke_icon('check')?>Passwort speichern</button>
      </form>
      <p class="hint">Aus Sicherheitsgründen wirst du auf allen Geräten neu angemeldet.</p>
    <?php endif; ?>
    <div class="foot">ETAF · Trainer-Koordination</div>
  </div>
</body></html>
