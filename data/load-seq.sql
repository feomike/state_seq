
-- Table: analysis.state_seq

DROP TABLE if exists analysis.state_seq;

CREATE TABLE analysis.state_seq
(
  fips character varying(2),
  State character varying(200),
  Total numeric,
  teachers_schools numeric,
  work_study_jobs numeric,
  head_start numeric,
  cleanAir_water numeric,
  military_readiness numeric,
  law_enforcement numeric,
  job_search_assistance numeric,
  child_care numeric,
  vaccines_children numeric,
  public_health numeric,
  stop_violence_against_women numeric,
  nutrition_assistance numeric  
)
WITH (
  OIDS=FALSE
);
ALTER TABLE analysis.state_seq OWNER TO postgres;

truncate analysis.state_seq; 
copy analysis.state_seq
  from '/Users/feomike/downloads/WH-State-Sequester-2.txt'
  header csv delimiter '|';
