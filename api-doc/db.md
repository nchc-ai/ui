# Database information

## user/password

* root / ogre0403
* twgc / twgc@NCHC

## Table Schema

### course

PK: id

AUTO_INCREMENT: id

do we need dataset ?

```sql
CREATE TABLE `course` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `intro` varchar(3000) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  `gpu` int DEFAULT 0,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### job

map to one deployment/service

PK: job_id

ADD UNIQUE KEY `job_id` (`job_id`);
AUTO_INCREMENT: job_id

course_template?
mode?
dataset
gateway_id
gateway_password
gateway_port
source_ip_address

```sql
CREATE TABLE `job` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` varchar(255) DEFAULT NULL,

  `user` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,

  `deployment` varchar(255) DEFAULT NULL,
  `service`  varchar(255) DEFAULT NULL,
  `proxy_url` varchar(255) DEFAULT NULL,

  
  `status` varchar(255) DEFAULT NULL,
  `createAt` datetime DEFAULT NULL,

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


### Uncessary database

user

docker_image

data_upload

gpu

host

job_gpu
