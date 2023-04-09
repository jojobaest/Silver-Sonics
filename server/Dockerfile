FROM alpine:3.17.3
RUN apk update
RUN apk add git
RUN git clone https://github.com/jojobaest/Silver-Sonics.git
FROM python:3-alpine3.17 
WORKDIR /silver-sonics 
COPY . /silver-sonics
RUN pip install -r requirements.txt
RUN pip install Pillow
EXPOSE 5000
CMD python ./jstopy.py 

