# # Primera imagen para compilar 
# FROM python:3.11.9-slim AS compile-image
# RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config
# # Se define una variable opcional
# RUN python3 -m venv /opt/venv
# # Se sobreescribe la variable path para que tenga prioridad los comandos del ambiente
# ENV PATH="/opt/venv/bin:$PATH"
# # Se copia unicamente el archivo de dependencias 

# COPY requeriments.txt /requeriments.txt
# # Se instalan las dependencias.
# RUN pip install -r requeriments.txt
# # Listo, inicia el segundo contenedor 
# FROM python:3.11.9-slim AS build-image
# # Se copia la carpeta venv que contiene todas las dependencias en el segundo contenedor
# COPY --from=compile-image /opt/venv /opt/venv
# # Se copia la aplicación
# COPY . /app
# # Se establece por defecto el directorio 
# WORKDIR /app
# # Se agrega el directorio a las variables de ambiente.
# ENV PATH="/opt/venv/bin:$PATH"
# # Arranca la aplicación
# EXPOSE 8000/tcp
# EXPOSE 8000/udp
# CMD ["python", "parking/manage.py", "runserver", "0.0.0.0:8000"]
FROM python:3.11.9-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY . /app
WORKDIR /app
# RUN apt-get update && apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config
RUN pip install -r requeriments.txt
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]