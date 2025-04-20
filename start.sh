#!/bin/sh
set -e

SECRETS_DIR="./secrets"
KEY_FILE="${SECRETS_DIR}/key.pem"
CERT_FILE="${SECRETS_DIR}/cert.pem"
PASSPHRASE="s4oy73E926l026Me832j34or"
SUBJ="/C=CO/ST=Caldas/L=Manizales/O=VictorStore/OU=IT"
VALID_DAYS=365
RENEW_INTERVAL=$((30*24*3600))  # 30 días en segundos

generate_cert() {
  mkdir -p "$SECRETS_DIR"
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days "$VALID_DAYS" \
    -passout pass:"$PASSPHRASE" \
    -subj "$SUBJ"
}

# 1) Generar al arranque si no existe o supera 30 días
if [ ! -f "$CERT_FILE" ] || find "$CERT_FILE" -mtime +30 | grep -q .; then
  echo "[start.sh] Generando certificado inicial..."
  generate_cert
fi

# 2) Loop de renovación en segundo plano
(
  while true; do
    sleep "$RENEW_INTERVAL"
    echo "[start.sh] Renovando certificado..."
    generate_cert
  done
) &

# 3) Arrancar la app
exec npm start