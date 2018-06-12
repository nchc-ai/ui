CREATE DATABASE twgc;


CREATE USER 'twgc'@'localhost' IDENTIFIED BY 'twgc@NCHC';
CREATE USER 'twgc'@'%' IDENTIFIED BY 'twgc@NCHC';


GRANT ALL ON twgc.* TO 'twgc'@'localhost';
GRANT ALL ON twgc.* TO 'twgc'@'%';