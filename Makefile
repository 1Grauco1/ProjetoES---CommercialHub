.PHONY: dev back front kill migrate lint format

kill:
	@pkill -9 -f "uvicorn app[.]main:app" 2>/dev/null; \
	pkill -9 -f "npm [r]un dev" 2>/dev/null; \
	pkill -9 -f "next[-]server" 2>/dev/null; \
	pkill -9 -f "next [d]ev" 2>/dev/null; \
	pkill -9 -f "make [d]ev" 2>/dev/null; \
	pkill -9 -f "make [b]ack" 2>/dev/null; \
	pkill -9 -f "make [f]ront" 2>/dev/null; \
	echo "Stopped back and front instances"

migrate:
	cd back && .venv/bin/alembic upgrade head

lint:
	cd back && .venv/bin/ruff check app/

format:
	cd back && .venv/bin/ruff format app/

back:
	cd back && .venv/bin/alembic upgrade head && .venv/bin/uvicorn app.main:app --reload --port 8000

front:
	cd front/commercialhub && npm run dev

dev:
	@trap 'kill "$$BACK" "$$FRONT" 2>/dev/null' INT TERM; \
	$(MAKE) back & BACK=$$!; \
	$(MAKE) front & FRONT=$$!; \
	wait "$$BACK" "$$FRONT"
