.PHONY: dev back front kill migrate lint format

kill:
	@pkill -f "uvicorn app.main:app" 2>/dev/null; \
	pkill -f "next dev" 2>/dev/null; \
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
