# Database information

> Note: We only create database in advanced. Tables will be created when api-server start,
and we don't need to run SQL commands to create tables.

## user/password

* root / ogre0403
* twgc / twgc@NCHC

## Table Schema

### courses


```sql
CREATE TABLE `courses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `user` varchar(50) NOT NULL,
  `provider` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL,
  `intro` varchar(3000) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `gpu` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_courses_deleted_at` (`deleted_at`)
)
```

### jobs


```
CREATE TABLE `jobs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `course_id` int(10) unsigned DEFAULT NULL,
  `deployment` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `proxy_url` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_jobs_deleted_at` (`deleted_at`),
  KEY `jobs_course_id_courses_id_foreign` (`course_id`),
  CONSTRAINT `jobs_course_id_courses_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
)
```


## datasets

```sql
CREATE TABLE `datasets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_datasets_deleted_at` (`deleted_at`)
)
```

## course_dataset

```sql
CREATE TABLE `course_dataset` (
  `course_id` int(10) unsigned NOT NULL,
  `dataset_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`course_id`,`dataset_id`)
)
```

### Uncessary database

* user
* docker_image
* data_upload
* gpu
* host
* job_gpu
