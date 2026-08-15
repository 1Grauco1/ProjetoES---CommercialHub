make dev -> roda back e front junto
make back -> roda back (já roda as migrations antes)
make front -> roda front

migrations:
  make migrate -> aplica migrations no banco
  rode quando baixar código novo com mudança no banco (ou em setup novo)

lint / format:
  make lint -> checa o código do back
  make format -> formata o código do back
  rode antes de commitar mudanças no back

se vc não tiver o pacote make
pesquise como baixa no seu OS
