-- Irisa Analyzer (MySQL) - 기본 스키마

CREATE TABLE IF NOT EXISTS raw_files (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  stored_path VARCHAR(512) NOT NULL,
  file_type VARCHAR(64) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_units (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  raw_file_id BIGINT NOT NULL,
  unit_type ENUM('page','time','row','table','other') NOT NULL,
  range_label VARCHAR(128) NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (raw_file_id) REFERENCES raw_files(id)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(128) NOT NULL,
  student_number VARCHAR(64),
  school_level ENUM('elementary','middle','high') NOT NULL,
  grade_label VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_datasets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS dataset_units (
  dataset_id BIGINT NOT NULL,
  unit_id BIGINT NOT NULL,
  PRIMARY KEY (dataset_id, unit_id),
  FOREIGN KEY (dataset_id) REFERENCES student_datasets(id),
  FOREIGN KEY (unit_id) REFERENCES extracted_units(id)
);

CREATE TABLE IF NOT EXISTS standard_references (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  reference_name VARCHAR(255) NOT NULL,
  reference_scope ENUM('SYSTEM','SCHOOL','TEACHER') NOT NULL,
  reference_purpose ENUM('ANALYSIS_GUIDE','WRITING_GUIDE','POLICY') NOT NULL,
  reference_content MEDIUMTEXT NOT NULL,
  source_file_id BIGINT,
  active_flag TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_file_id) REFERENCES raw_files(id)
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  dataset_id BIGINT NOT NULL,
  teacher_summary MEDIUMTEXT NOT NULL,
  student_summary MEDIUMTEXT NOT NULL,
  record_guide MEDIUMTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dataset_id) REFERENCES student_datasets(id)
);
