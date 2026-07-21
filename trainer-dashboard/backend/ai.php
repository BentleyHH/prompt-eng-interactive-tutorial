<?php
/**
 * ETAF — KI-Profilanlage via Claude API (Messages API, strukturierte JSON-Ausgabe).
 * Dependency-frei (curl). Modell: claude-opus-4-8.
 */
require_once __DIR__.'/lib.php';

/** Extrahiert Trainer-Profile aus freiem Text (CV / Excel-Kopie / Angebot). */
function ai_extract_profiles(string $text): array {
  $c=cfg();
  $key=trim($c['anthropic_key']??'');
  if($key==='') throw new RuntimeException('KI nicht konfiguriert — trage anthropic_key in config.php ein.');
  $model=$c['anthropic_model']??'claude-opus-4-8';

  // Strukturierte Ausgabe: garantiert gültiges JSON nach diesem Schema.
  $schema=[
    'type'=>'object',
    'properties'=>[
      'trainers'=>[
        'type'=>'array',
        'items'=>[
          'type'=>'object',
          'properties'=>[
            'name'=>['type'=>'string'],
            'email'=>['type'=>'string'],
            'phone'=>['type'=>'string'],
            'spec'=>['type'=>'array','items'=>['type'=>'string']],
            'region'=>['type'=>'string'],
            'langs'=>['type'=>'array','items'=>['type'=>'string']],
            'uae'=>['type'=>'boolean'],
            'rating'=>['type'=>'string'],
          ],
          'required'=>['name','email','phone','spec','region','langs','uae','rating'],
          'additionalProperties'=>false,
        ],
      ],
    ],
    'required'=>['trainers'],
    'additionalProperties'=>false,
  ];

  $prompt=
    "Extrahiere aus dem folgenden Text (Lebenslauf, Excel-Kopie, Angebot o.ä.) alle Trainer-Profile "
    ."für eine Dental-Trainingsorganisation.\n"
    ."- 'spec': Fachgebiete wie Implantologie, DNA-Diagnostik, Fingerprint Dental, Prothetik, Chirurgie, "
    ."Digitale Abformung, Guided Surgery, Parodontologie.\n"
    ."- 'region': z.B. DE-Süd, DE-West, DE-Nord, AT, CH, UAE, UK.\n"
    ."- 'langs': Sprachkürzel (DE, EN, AR).\n"
    ."- 'uae': true, wenn Erfahrung im Nahen Osten / UAE erkennbar ist, sonst false.\n"
    ."- 'rating': Zahl 4.0–5.0 als Text; wenn unbekannt, \"4.5\".\n"
    ."Fehlende Felder sinnvoll leer lassen (\"\" bzw. []). Erfinde keine Personen.\n\n"
    ."=== TEXT ===\n".$text;

  $body=[
    'model'=>$model,
    'max_tokens'=>4096,
    'output_config'=>['format'=>['type'=>'json_schema','schema'=>$schema]],
    'messages'=>[['role'=>'user','content'=>$prompt]],
  ];

  $ch=curl_init('https://api.anthropic.com/v1/messages');
  curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_POST=>true,
    CURLOPT_HTTPHEADER=>[
      'content-type: application/json',
      'x-api-key: '.$key,
      'anthropic-version: 2023-06-01',
    ],
    CURLOPT_POSTFIELDS=>json_encode($body,JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT=>90,
  ]);
  $resp=curl_exec($ch);
  $code=curl_getinfo($ch,CURLINFO_HTTP_CODE);
  $err=curl_error($ch);
  curl_close($ch);
  if($resp===false) throw new RuntimeException('Netzwerkfehler zur Claude API: '.$err);
  $data=json_decode($resp,true);
  if($code>=400) throw new RuntimeException('Claude API ('.$code.'): '.($data['error']['message']??substr($resp,0,300)));

  // Bei output_config.format enthält der erste text-Block gültiges JSON.
  $out='';
  foreach(($data['content']??[]) as $b){ if(($b['type']??'')==='text'){ $out=$b['text']; break; } }
  $parsed=json_decode($out,true);
  if(!is_array($parsed) || !isset($parsed['trainers']) || !is_array($parsed['trainers']))
    throw new RuntimeException('Unerwartete KI-Antwort.');
  return $parsed['trainers'];
}
