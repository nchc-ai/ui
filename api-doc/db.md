# Database information

## User

* root / ogre0403
* twgc / twgc@NCHC

## Table Schema

### course
PK: id
AUTO_INCREMENT: id

```sql
CREATE TABLE `course` (
  `id` bigint(20) NOT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `course_intro` varchar(3000) DEFAULT NULL,
  `docker_name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `dataset` varchar(300) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### job

PK: job_id

ADD UNIQUE KEY `job_id` (`job_id`);
AUTO_INCREMENT: job_id

```sql
CREATE TABLE `job` (
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `hardware` varchar(255) DEFAULT '1',
  `di_id` varchar(255) DEFAULT NULL,
  `gateway_id` varchar(255) DEFAULT NULL,
  `gateway_password` varchar(255) DEFAULT NULL,
  `gateway_port` varchar(255) DEFAULT '0',
  `source_ip_address` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `dt_create` datetime DEFAULT NULL,
  `dt_release` datetime DEFAULT NULL,
  `aid` varchar(255) DEFAULT NULL,
  `id` varchar(255) DEFAULT NULL,
  `docker_server` varchar(255) DEFAULT NULL,
  `mode` varchar(255) NOT NULL DEFAULT '0',
  `cmd` varchar(255) DEFAULT NULL,
  `course_id` varchar(255) DEFAULT NULL,
  `course_template` varchar(255) NOT NULL DEFAULT '0',
  `dataset` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### user

PK: aid
ADD KEY `pid` (`pid`) USING BTREE;
AUTO_INCREMENT: aid

```sql
CREATE TABLE `user` (
  `aid` int(4) UNSIGNED NOT NULL,
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `tel` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `domain` enum('生技醫療','智慧製造','智慧服務','智慧技術') COLLATE utf8_unicode_ci DEFAULT '生技醫療',
  `pid` int(1) UNSIGNED DEFAULT NULL,
  `dt_register` datetime NOT NULL,
  `dt_email_confirm` datetime DEFAULT NULL,
  `dt_project_leader_confirm` datetime DEFAULT NULL,
  `iam` enum('0','1') COLLATE utf8_unicode_ci DEFAULT '0',
  `container_limit` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `admin_level` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

```

### image

PK: di_id
AUTO_INCREMENT: di_id


```sql
CREATE TABLE `docker_image` (
  `di_id` int(2) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tag` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `software_list` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mode` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `cmd` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```




data_upload

gpu

host

job_gpu
