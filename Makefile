# Levantar la base de datos 
start-db:
	docker compose up -d db 

# Dar de baja la base de datos
stop-db:
	docker stop biblioteca-db
 