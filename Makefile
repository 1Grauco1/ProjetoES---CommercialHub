.PHONY: dev back front

back:
	cd back && .venv/bin/uvicorn app.main:app --reload --port 8000

front:
	cd front/commercialhub && npm run dev

dev:
	@trap 'kill "$$BACK" "$$FRONT" 2>/dev/null' INT TERM; \
	$(MAKE) back & BACK=$$!; \
	$(MAKE) front & FRONT=$$!; \
	wait "$$BACK" "$$FRONT"
