export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ObfId: number;
  /** A datetime string with format in ISO8601 `YYYY-MM-DDTHH:mm:ss.sssZ` */
  DateTime: string;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: string;
  /**
   * The `JSON` scalar type represents JSON values as specified by
   *         [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
   */
  JSON: any;
  BigInt: number;
  /**
   * Loose type that allows any value. Be careful when passing in large `Int` or `Float` literals,
   * as they may not be parsed correctly on the server side. Use `String` literals if you are
   * dealing with really large numbers to be on the safe side.
   */
  Mixed: any;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`, timezone from request will be used */
  DateRequestTz: any;
  /** Can be used as an argument to upload files using https://github.com/jaydenseric/graphql-multipart-request-spec */
  Upload: any;
};

export type AddToBucketInput = {
  candidate_ids?: Maybe<Array<Scalars['ObfId']>>;
  client_ids?: Maybe<Array<Scalars['ObfId']>>;
  company_ids?: Maybe<Array<Scalars['ObfId']>>;
  project_ids?: Maybe<Array<Scalars['ObfId']>>;
  notes?: Maybe<Scalars['String']>;
};


export enum BillingType {
  /** Hourly */
  Hourly = 'HOURLY',
  /** Daily */
  Daily = 'DAILY'
}

export type Bucket = {
  __typename?: 'Bucket';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  owner_id: Scalars['ObfId'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  owner: User;
  shared_with: Array<User>;
  candidates: Array<Candidate>;
  clients: Array<Client>;
  companies: Array<Company>;
  projects: Array<Project>;
  histories: Array<History>;
  bucket_user_permission?: Maybe<BucketUserPermission>;
};

export type BucketableSyncInput = {
  bucketable_id: Scalars['ObfId'];
  notes?: Maybe<Scalars['String']>;
};

export type BucketMorphItemPivot = {
  __typename?: 'BucketMorphItemPivot';
  notes?: Maybe<Scalars['String']>;
};

export type BucketPermissionSyncInput = {
  user_id: Scalars['ObfId'];
  is_write_allowed?: Maybe<Scalars['Boolean']>;
};

export type BucketUserPermission = {
  __typename?: 'BucketUserPermission';
  bucket_id?: Maybe<Scalars['ObfId']>;
  user_id?: Maybe<Scalars['ObfId']>;
  is_write_allowed: Scalars['Boolean'];
};

export type Candidate = {
  __typename?: 'Candidate';
  id: Scalars['ObfId'];
  email?: Maybe<Scalars['String']>;
  is_blacklisted?: Maybe<Scalars['Boolean']>;
  blacklisting_reason?: Maybe<Scalars['String']>;
  is_interim: Scalars['Boolean'];
  is_permanent: Scalars['Boolean'];
  marital_status?: Maybe<Scalars['String']>;
  skype_name?: Maybe<Scalars['String']>;
  desired_job?: Maybe<Scalars['String']>;
  max_distance_from_home?: Maybe<Scalars['String']>;
  willing_to_travel?: Maybe<Scalars['Int']>;
  available_from?: Maybe<Scalars['Date']>;
  daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  period_of_notice?: Maybe<Scalars['JSON']>;
  next_possible_notice_to?: Maybe<Scalars['Date']>;
  basic_salary?: Maybe<Scalars['Float']>;
  bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  other_bonus?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  linked_in_profile?: Maybe<Scalars['String']>;
  xing_profile?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  was_placed?: Maybe<Scalars['Boolean']>;
  caution?: Maybe<Scalars['Boolean']>;
  is_research?: Maybe<Scalars['Boolean']>;
  create_account_token?: Maybe<Scalars['String']>;
  has_hourly_rate: Scalars['Boolean'];
  zoom_id?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  user_id?: Maybe<Scalars['ObfId']>;
  match_score?: Maybe<Scalars['Int']>;
  industries_count?: Maybe<Scalars['Int']>;
  skills_count?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
  person: Person;
  location?: Maybe<Location>;
  phonenumbers: Array<Phonenumber>;
  histories: Array<History>;
  industries: Array<Industry>;
  skills: Array<Skill>;
  certifications: Array<Certification>;
  it_skills: Array<ItSkill>;
  is_in_project: Scalars['Boolean'];
  projects: Array<Project>;
  documents: Array<Document>;
  languages: Array<Language>;
  nationalities: Array<Nationality>;
  events: Array<Event>;
  events_in_project: Array<Event>;
  events_in_shared_project_for_client: Array<Event>;
  events_in_project_for_client: Array<Event>;
  cv_documents: Array<Document>;
  ch_categories: Array<ChCategory>;
  worked_at_companies: Array<CandidateCompany>;
  educations: Array<Education>;
  working_hours: Array<WorkingHours>;
  candidate_project_pivot?: Maybe<CandidateProjectPivot>;
  bucket_candidate_pivot?: Maybe<BucketMorphItemPivot>;
  candidate_ch_category_pivot?: Maybe<CandidateChCategoryPivot>;
  placed_projects?: Maybe<ProjectPaginator>;
};


export type CandidateIs_In_ProjectArgs = {
  project_id: Scalars['ObfId'];
};


export type CandidateEvents_In_ProjectArgs = {
  projectId: Scalars['ObfId'];
};


export type CandidateEvents_In_Shared_Project_For_ClientArgs = {
  token: Scalars['String'];
};


export type CandidateEvents_In_Project_For_ClientArgs = {
  projectId: Scalars['ObfId'];
};


export type CandidateWorking_HoursArgs = {
  project_id?: Maybe<Scalars['ObfId']>;
};


export type CandidatePlaced_ProjectsArgs = {
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type CandidateAndEvent = {
  __typename?: 'CandidateAndEvent';
  candidate: Candidate;
  event: Event;
};

export type CandidateChCategoryPivot = {
  __typename?: 'CandidateChCategoryPivot';
  ch_category_id: Scalars['ObfId'];
  candidate_id: Scalars['ObfId'];
  text?: Maybe<Scalars['String']>;
  phonenumber?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  work_time?: Maybe<WorkTime>;
  work_place?: Maybe<WorkPlace>;
  created_at: Scalars['DateTime'];
};

export type CandidateChCategoryRelationInput = {
  id: Scalars['ObfId'];
  text?: Maybe<Scalars['String']>;
  phonenumber?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  work_time?: Maybe<WorkTime>;
  work_place?: Maybe<WorkPlace>;
};

export type CandidateCompany = {
  __typename?: 'CandidateCompany';
  id?: Maybe<Scalars['ObfId']>;
  candidate_id?: Maybe<Scalars['ObfId']>;
  company_id?: Maybe<Scalars['ObfId']>;
  from?: Maybe<Scalars['Date']>;
  till?: Maybe<Scalars['Date']>;
  job_title?: Maybe<Scalars['String']>;
  job_level?: Maybe<JobLevel>;
  main_responsibilities?: Maybe<Array<Scalars['String']>>;
  company?: Maybe<Company>;
  candidate?: Maybe<Candidate>;
};

export type CandidateCompanyRelationInput = {
  id?: Maybe<Scalars['ObfId']>;
  company_id: Scalars['ObfId'];
  from?: Maybe<Scalars['Date']>;
  till?: Maybe<Scalars['Date']>;
  job_title?: Maybe<Scalars['String']>;
  job_level?: Maybe<JobLevel>;
  main_responsibilities?: Maybe<Array<Scalars['String']>>;
};

/** A paginated list of Candidate items. */
export type CandidatePaginator = {
  __typename?: 'CandidatePaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Candidate items. */
  data: Array<Candidate>;
};

export type CandidateProjectPivot = {
  __typename?: 'CandidateProjectPivot';
  project_id?: Maybe<Scalars['ObfId']>;
  candidate_id?: Maybe<Scalars['ObfId']>;
  status: CandidateStatusInProject;
  is_shortlisted: Scalars['Boolean'];
  purchasing_daily_rate?: Maybe<Scalars['Float']>;
  retail_daily_rate?: Maybe<Scalars['Float']>;
  basic_salary?: Maybe<Scalars['Float']>;
  bonus_eur?: Maybe<Scalars['Float']>;
  client_notes?: Maybe<Scalars['String']>;
  liked_by_client?: Maybe<Scalars['Boolean']>;
  consented_at?: Maybe<Scalars['DateTime']>;
  contradicted_at?: Maybe<Scalars['DateTime']>;
  consent_sent_to_email?: Maybe<Scalars['String']>;
  consent_sent_at?: Maybe<Scalars['DateTime']>;
  project: Project;
  candidate: Candidate;
};

export type CandidateProjectPivotInput = {
  purchasing_daily_rate?: Maybe<Scalars['Float']>;
  retail_daily_rate?: Maybe<Scalars['Float']>;
  basic_salary?: Maybe<Scalars['Float']>;
  bonus_eur?: Maybe<Scalars['Float']>;
};

export type CandidatesFilter = {
  is_interim?: Maybe<Scalars['Boolean']>;
  available_from?: Maybe<Scalars['Date']>;
  daily_rate_max?: Maybe<Scalars['Float']>;
  is_permanent?: Maybe<Scalars['Boolean']>;
  salary_package_max?: Maybe<Scalars['Float']>;
  industries?: Maybe<Array<Scalars['ObfId']>>;
  certifications?: Maybe<Array<Scalars['ObfId']>>;
  it_skills?: Maybe<Array<Scalars['ObfId']>>;
  skills?: Maybe<Array<Scalars['ObfId']>>;
  keywords_search?: Maybe<Array<Scalars['String']>>;
  location?: Maybe<CreateLocationInput>;
  location_radius?: Maybe<Scalars['Int']>;
  language_codes?: Maybe<Array<Scalars['String']>>;
  job_levels?: Maybe<Array<JobLevel>>;
};

export enum CandidateStatusInProject {
  /** Longlisted */
  Longlisted = 'LONGLISTED',
  /** Shortlisted */
  Shortlisted = 'SHORTLISTED',
  /** On hold */
  OnHold = 'ON_HOLD',
  /** Rejected by client */
  RejectedByClient = 'REJECTED_BY_CLIENT',
  /** Rejected by candidate */
  RejectedByCandidate = 'REJECTED_BY_CANDIDATE',
  /** Rejected by blackbull */
  RejectedByBlackbull = 'REJECTED_BY_BLACKBULL',
  /** Client interview */
  ClientInterview = 'CLIENT_INTERVIEW',
  /** Second client interview */
  SecondClientInterview = 'SECOND_CLIENT_INTERVIEW',
  /** Additional client interview */
  AdditionalClientInterview = 'ADDITIONAL_CLIENT_INTERVIEW',
  /** Final client interview */
  FinalClientInterview = 'FINAL_CLIENT_INTERVIEW',
  /** Under offer */
  UnderOffer = 'UNDER_OFFER',
  /** Placed */
  Placed = 'PLACED'
}

export type Certification = {
  __typename?: 'Certification';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  is_reviewed: Scalars['Boolean'];
  parent_id?: Maybe<Scalars['ObfId']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  synonyms: Array<Certification>;
  synonym_representative?: Maybe<Certification>;
  parent?: Maybe<Certification>;
  children: Array<Certification>;
};

/** A paginated list of Certification items. */
export type CertificationPaginator = {
  __typename?: 'CertificationPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Certification items. */
  data: Array<Certification>;
};

export type ChArticle = {
  __typename?: 'ChArticle';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  image_copyright?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  content: Scalars['String'];
  author: Scalars['String'];
  author_position?: Maybe<Scalars['String']>;
  author_company?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  read_time?: Maybe<Scalars['Int']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  image?: Maybe<Image>;
  author_image?: Maybe<Image>;
  other_articles_in_category: Array<ChArticle>;
  other_articles_without_category: Array<ChArticle>;
};

export type ChCategory = {
  __typename?: 'ChCategory';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  slug: Scalars['String'];
  short_text: Scalars['String'];
  long_text: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  candidates: Array<Candidate>;
  candidate_ch_category_pivot?: Maybe<CandidateChCategoryPivot>;
};

export type ChPodcast = {
  __typename?: 'ChPodcast';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  slug: Scalars['String'];
  description: Scalars['String'];
  rss_title: Scalars['String'];
  rss_description: Scalars['String'];
  duration: Scalars['Int'];
  category?: Maybe<Scalars['String']>;
  public_url?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  image?: Maybe<Image>;
  other_podcasts: Array<ChPodcast>;
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['ObfId'];
  email?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  need_review_after_autocomplete: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  is_research: Scalars['Boolean'];
  create_account_token?: Maybe<Scalars['String']>;
  zoom_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['ObfId']>;
  user?: Maybe<User>;
  person: Person;
  company?: Maybe<Company>;
  location?: Maybe<Location>;
  phonenumbers: Array<Phonenumber>;
  histories: Array<History>;
  events: Array<Event>;
  bucket_client_pivot?: Maybe<BucketMorphItemPivot>;
  client_project_pivot?: Maybe<ClientProjectPivot>;
  projects?: Maybe<ProjectPaginator>;
  active_projects?: Maybe<ProjectPaginator>;
  runner_projects?: Maybe<ProjectPaginator>;
};


export type ClientProjectsArgs = {
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type ClientActive_ProjectsArgs = {
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type ClientRunner_ProjectsArgs = {
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

/** A paginated list of Client items. */
export type ClientPaginator = {
  __typename?: 'ClientPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Client items. */
  data: Array<Client>;
};

export type ClientProjectPivot = {
  __typename?: 'ClientProjectPivot';
  project_id?: Maybe<Scalars['ObfId']>;
  client_id?: Maybe<Scalars['ObfId']>;
  has_long_list_access: Scalars['Boolean'];
  project: Project;
  client: Client;
};

export type ClientRelationInput = {
  id: Scalars['ObfId'];
  has_long_list_access?: Maybe<Scalars['Boolean']>;
};

export type ClientsFilter = {
  industries?: Maybe<Array<Scalars['ObfId']>>;
  location?: Maybe<CreateLocationInput>;
  location_radius?: Maybe<Scalars['Int']>;
};

export type CompaniesFilter = {
  industries?: Maybe<Array<Scalars['ObfId']>>;
  location?: Maybe<CreateLocationInput>;
  location_radius?: Maybe<Scalars['Int']>;
  min_employees_count?: Maybe<Scalars['Int']>;
  max_employees_count?: Maybe<Scalars['Int']>;
  min_annual_sales?: Maybe<Scalars['Float']>;
  max_annual_sales?: Maybe<Scalars['Float']>;
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['ObfId'];
  name: Scalars['String'];
  legal_form?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employees_count?: Maybe<Scalars['String']>;
  annual_sales?: Maybe<Scalars['Float']>;
  about?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  need_review_after_autocomplete: Scalars['Boolean'];
  jobs_external_link?: Maybe<Scalars['String']>;
  invoice_notes?: Maybe<Scalars['String']>;
  aliasOrName: Scalars['String'];
  complete_name: Scalars['String'];
  industries: Array<Industry>;
  locations: Array<Location>;
  phonenumbers: Array<Phonenumber>;
  logo?: Maybe<Image>;
  child_companies: Array<Company>;
  parent_company?: Maybe<Company>;
  clients: Array<Client>;
  histories: Array<History>;
  candidates?: Maybe<Array<Candidate>>;
  candidatesCount?: Maybe<Scalars['Int']>;
  projects: Array<Project>;
  documents: Array<Document>;
  events: Array<Event>;
  eventsInclClients: Array<Event>;
  pivot?: Maybe<CandidateCompany>;
  bucket_company_pivot?: Maybe<BucketMorphItemPivot>;
};

/** A paginated list of Company items. */
export type CompanyPaginator = {
  __typename?: 'CompanyPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Company items. */
  data: Array<Company>;
};

export type CreateBucketInput = {
  title: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  owner_id: Scalars['ObfId'];
  shared_with?: Maybe<UpdateBucketPermissionsRelation>;
};

export type CreateCandidateInput = {
  email?: Maybe<Scalars['String']>;
  is_blacklisted?: Maybe<Scalars['Boolean']>;
  blacklisting_reason?: Maybe<Scalars['String']>;
  is_interim: Scalars['Boolean'];
  is_permanent: Scalars['Boolean'];
  marital_status?: Maybe<Scalars['String']>;
  skype_name?: Maybe<Scalars['String']>;
  desired_job?: Maybe<Scalars['String']>;
  max_distance_from_home?: Maybe<Scalars['String']>;
  willing_to_travel?: Maybe<Scalars['Int']>;
  available_from?: Maybe<Scalars['Date']>;
  daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  period_of_notice?: Maybe<Scalars['JSON']>;
  basic_salary?: Maybe<Scalars['Float']>;
  bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  other_bonus?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  linked_in_profile?: Maybe<Scalars['String']>;
  xing_profile?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  is_research?: Maybe<Scalars['Boolean']>;
  has_hourly_rate?: Maybe<Scalars['Boolean']>;
  zoom_id?: Maybe<Scalars['String']>;
  person?: Maybe<DefinePersonRelation>;
  location?: Maybe<CreateLocationRelation>;
  phonenumbers?: Maybe<CreatePhonenumberRelation>;
  industries?: Maybe<DefineIndustryRelation>;
  skills?: Maybe<DefineSkillRelation>;
  certifications?: Maybe<DefineCertificationRelation>;
  it_skills?: Maybe<DefineItSkillRelation>;
  languages?: Maybe<DefineLanguageRelation>;
  nationalities?: Maybe<DefineNationalityRelation>;
  educations?: Maybe<UpdateEducationRelation>;
};

export type CreateCertificationInput = {
  title: Scalars['String'];
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
};

export type CreateChArticleInput = {
  title: Scalars['String'];
  image_copyright?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  category: Scalars['String'];
  author: Scalars['String'];
  author_position?: Maybe<Scalars['String']>;
  author_company?: Maybe<Scalars['String']>;
  image?: Maybe<CroppedImageUpload>;
  author_image?: Maybe<CroppedImageUpload>;
};

export type CreateChCategoryInput = {
  title: Scalars['String'];
  short_text: Scalars['String'];
  long_text: Scalars['String'];
  candidates?: Maybe<UpdateCandidateChCategoryRelation>;
};

export type CreateChPodcastInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  rss_title: Scalars['String'];
  rss_description: Scalars['String'];
  duration: Scalars['Int'];
  category?: Maybe<Scalars['String']>;
  image?: Maybe<CroppedImageUpload>;
};

export type CreateClientInput = {
  email?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['ObfId']>;
  location_id?: Maybe<Scalars['ObfId']>;
  need_review_after_autocomplete?: Maybe<Scalars['Boolean']>;
  notes?: Maybe<Scalars['String']>;
  is_research?: Maybe<Scalars['Boolean']>;
  zoom_id?: Maybe<Scalars['String']>;
  person?: Maybe<DefinePersonRelation>;
  phonenumbers?: Maybe<CreatePhonenumberRelation>;
};

export type CreateCompanyInput = {
  name: Scalars['String'];
  legal_form?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employees_count?: Maybe<Scalars['String']>;
  annual_sales?: Maybe<Scalars['Float']>;
  about?: Maybe<Scalars['String']>;
  need_review_after_autocomplete?: Maybe<Scalars['Boolean']>;
  jobs_external_link?: Maybe<Scalars['String']>;
  invoice_notes?: Maybe<Scalars['String']>;
  industries?: Maybe<DefineIndustryRelation>;
  locations?: Maybe<CreateLocationsRelation>;
  phonenumbers?: Maybe<CreatePhonenumberRelation>;
  logo?: Maybe<CroppedImageUpload>;
};

export type CreateDocumentInput = {
  title: Scalars['String'];
  file: Scalars['Upload'];
  tags?: Maybe<DefineDocumentTagRelation>;
};

export type CreateDocumentTagInput = {
  title: Scalars['String'];
};

export type CreateEmployeeInput = {
  user_id?: Maybe<Scalars['ObfId']>;
  personalnummer?: Maybe<Scalars['String']>;
  betr_personalnummer?: Maybe<Scalars['String']>;
  familienname: Scalars['String'];
  geburtsname?: Maybe<Scalars['String']>;
  vorname: Scalars['String'];
  geburtsdatum?: Maybe<Scalars['Date']>;
  geschlecht: Gender;
  versicherungsnummer?: Maybe<Scalars['String']>;
  geburtsort?: Maybe<Scalars['String']>;
  familienstand?: Maybe<Scalars['String']>;
  schwerbehindert?: Maybe<Scalars['Boolean']>;
  iban: Scalars['String'];
  bic: Scalars['String'];
  eintrittsdatum: Scalars['Date'];
  ersteintrittsdatum: Scalars['Date'];
  betriebsstaette: Scalars['String'];
  berufsbezeichnung: Scalars['String'];
  ausgeuebte_taetigkeit: Scalars['String'];
  beschaeftigungsart: EmployeeBeschaeftigungsart;
  probezeit: Scalars['Boolean'];
  probezeit_dauer?: Maybe<Scalars['String']>;
  weitere_beschaeftigungen: Scalars['Boolean'];
  ist_weitere_beschaeftigung_geringfuegig: Scalars['Boolean'];
  hoechster_schullabschluss: EmployeeSchulabschluss;
  hoechste_berufsausbildung: EmployeeBerufsausbildung;
  beginn_der_ausbildung?: Maybe<Scalars['Date']>;
  voraussichtliches_ende_der_ausbildung?: Maybe<Scalars['Date']>;
  im_baugewerbe_seit?: Maybe<Scalars['Date']>;
  woechentliche_arbeitszeit: EmployeeWoechentlicheArbeitszeit;
  verteilung_der_woechentlichen_arbeitszeit?: Maybe<Scalars['JSON']>;
  urlaubsanspruch: Scalars['Int'];
  ist_befristet: Scalars['Boolean'];
  ist_zweckbefristet: Scalars['Boolean'];
  befristung_arbeitsvertrag_zum?: Maybe<Scalars['Date']>;
  schrieftlicher_abschluss_des_befristeten_arbeitsvertrages: Scalars['Boolean'];
  abschluss_arbeitsvertrag_am?: Maybe<Scalars['Date']>;
  befristet_mit_aussicht: Scalars['Boolean'];
  ich_wiederspreche_bea_an_bafa: Scalars['Boolean'];
  identifikationsnummer: Scalars['String'];
  finanzamt_nummer: Scalars['String'];
  steuerklasse_faktor: Scalars['String'];
  kinderfreibetraege?: Maybe<Scalars['String']>;
  konfession?: Maybe<Scalars['String']>;
  gesetzliche_krankenkasse: Scalars['String'];
  elterneigenschaft: Scalars['Boolean'];
  entl_bezeichnung?: Maybe<Scalars['String']>;
  entl_betrag?: Maybe<Scalars['Float']>;
  entl_gueltig_ab?: Maybe<Scalars['Date']>;
  stundenlohn?: Maybe<Scalars['Float']>;
  stundenlohn_gueltig_ab?: Maybe<Scalars['Date']>;
  vwl_empfaenger?: Maybe<Scalars['String']>;
  vwl_betrag?: Maybe<Scalars['Float']>;
  vwl_ag_anteil?: Maybe<Scalars['Float']>;
  vwl_seit_wann?: Maybe<Scalars['Date']>;
  vwl_vertragsnummer?: Maybe<Scalars['String']>;
  vwl_iban?: Maybe<Scalars['String']>;
  vwl_bic?: Maybe<Scalars['String']>;
  steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr?: Maybe<Scalars['JSON']>;
  location?: Maybe<CreateLocationRelation>;
  staatsangehoerigkeit?: Maybe<DefineNationalityRelation>;
};

export type CreateEventInput = {
  eventable_type: Scalars['String'];
  eventable_id: Scalars['ObfId'];
  project_id?: Maybe<Scalars['ObfId']>;
  user_id: Scalars['ObfId'];
  group: EventGroup;
  type: EventType;
  notes?: Maybe<Scalars['String']>;
  happened_at: Scalars['DateTime'];
};

export type CreateIndustryInput = {
  title: Scalars['String'];
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
};

export type CreateInstitutionInput = {
  name: Scalars['String'];
  is_reviewed?: Maybe<Scalars['Boolean']>;
};

export type CreateItSkillInput = {
  title: Scalars['String'];
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
};

export type CreateLocationInput = {
  postal_code?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  house_number?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  full_address?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  long?: Maybe<Scalars['Float']>;
};

export type CreateLocationRelation = {
  create?: Maybe<CreateLocationInput>;
};

export type CreateLocationsRelation = {
  create?: Maybe<Array<CreateLocationInput>>;
};

export type CreatePhonenumberInput = {
  country_code: Scalars['String'];
  dial_code: Scalars['String'];
  number: Scalars['String'];
  label?: Maybe<Scalars['String']>;
};

export type CreatePhonenumberRelation = {
  create?: Maybe<Array<CreatePhonenumberInput>>;
};

export type CreateProjectInput = {
  is_interim: Scalars['Boolean'];
  is_permanent: Scalars['Boolean'];
  title: Scalars['String'];
  max_basic_salary?: Maybe<Scalars['Float']>;
  max_bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  fee_structure?: Maybe<Scalars['Int']>;
  max_daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  retain?: Maybe<Scalars['Float']>;
  project_start: Scalars['Date'];
  project_end?: Maybe<Scalars['Date']>;
  notes?: Maybe<Scalars['String']>;
  ir_name?: Maybe<Scalars['String']>;
  ir_email?: Maybe<Scalars['String']>;
  ir_phone?: Maybe<Scalars['String']>;
  ir_vat?: Maybe<Scalars['String']>;
  ir_po?: Maybe<Scalars['String']>;
  ir_address?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['ObfId']>;
  clients?: Maybe<DefineClientRelation>;
  industries?: Maybe<DefineIndustryRelation>;
  skills?: Maybe<DefineSkillRelation>;
  certifications?: Maybe<DefineCertificationRelation>;
  it_skills?: Maybe<DefineItSkillRelation>;
  languages?: Maybe<DefineLanguageRelation>;
  users?: Maybe<UpdateProjectUserRelation>;
  documents?: Maybe<UpdateDocumentsRelationInput>;
};

export type CreateRevenueInput = {
  year: Scalars['Int'];
  month: Scalars['Int'];
  amount: Scalars['BigInt'];
  type: RevenueType;
  stage: RevenueStage;
  project_id: Scalars['ObfId'];
  users?: Maybe<UpdateRevenueUserRelation>;
};

export type CreateSkillInput = {
  title: Scalars['String'];
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
};

export type CreateWorkingHoursInput = {
  project_id: Scalars['ObfId'];
  candidate_id: Scalars['ObfId'];
  units: Array<WorkingHoursUnitInput>;
};

export type CroppedImageUpload = {
  file?: Maybe<Scalars['Upload']>;
  cropProps: CropPropsInput;
  sizeName: Scalars['String'];
};

export type CropProps = {
  __typename?: 'CropProps';
  top: Scalars['Int'];
  left: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};

export type CropPropsInput = {
  top?: Maybe<Scalars['Int']>;
  left?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
};




export type DefineCertificationRelation = {
  sync: Array<Scalars['ObfId']>;
};

export type DefineClientRelation = {
  sync?: Maybe<Array<ClientRelationInput>>;
  syncWithoutDetaching?: Maybe<Array<ClientRelationInput>>;
};

export type DefineDocumentTagRelation = {
  sync: Array<Scalars['ObfId']>;
};

export type DefineIndustryRelation = {
  sync: Array<Scalars['ObfId']>;
};

export type DefineItSkillRelation = {
  sync: Array<Scalars['ObfId']>;
};

export type DefineLanguageRelation = {
  sync: Array<LanguageRelationInput>;
};

export type DefineNationalityRelation = {
  sync: Array<NationalityRelationInput>;
};

export type DefinePersonRelation = {
  upsert?: Maybe<UpsertPersonInput>;
};

export type DefineSkillRelation = {
  sync: Array<Scalars['ObfId']>;
};

export type Document = {
  __typename?: 'Document';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  mime_type: Scalars['String'];
  parsing_status?: Maybe<DocumentParsingStatus>;
  parsed_content?: Maybe<Scalars['String']>;
  parsing_failure_reason?: Maybe<Scalars['String']>;
  preview_path?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  tags: Array<DocumentTag>;
};

export enum DocumentParsingStatus {
  /** Not needed */
  NotNeeded = 'NOT_NEEDED',
  /** Queued */
  Queued = 'QUEUED',
  /** Processing */
  Processing = 'PROCESSING',
  /** Succeeded */
  Succeeded = 'SUCCEEDED',
  /** Failed */
  Failed = 'FAILED',
  /** Unknown format */
  UnknownFormat = 'UNKNOWN_FORMAT'
}

export type DocumentTag = {
  __typename?: 'DocumentTag';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  documents: Array<Document>;
};

export type Education = {
  __typename?: 'Education';
  id?: Maybe<Scalars['ObfId']>;
  institution_id?: Maybe<Scalars['ObfId']>;
  candidate_id?: Maybe<Scalars['ObfId']>;
  from?: Maybe<Scalars['Date']>;
  till?: Maybe<Scalars['Date']>;
  main_field_of_study?: Maybe<Scalars['String']>;
  additional_fields_of_study: Array<Scalars['String']>;
  degree?: Maybe<Scalars['String']>;
  final_grade?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  institution?: Maybe<Institution>;
  candidate?: Maybe<Candidate>;
};

export type EducationRelationInput = {
  id?: Maybe<Scalars['ObfId']>;
  institution_id: Scalars['ObfId'];
  from?: Maybe<Scalars['Date']>;
  till?: Maybe<Scalars['Date']>;
  main_field_of_study?: Maybe<Scalars['String']>;
  additional_fields_of_study?: Maybe<Array<Scalars['String']>>;
  degree?: Maybe<Scalars['String']>;
  final_grade?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['ObfId'];
  user_id?: Maybe<Scalars['ObfId']>;
  personalnummer?: Maybe<Scalars['String']>;
  betr_personalnummer?: Maybe<Scalars['String']>;
  familienname: Scalars['String'];
  geburtsname?: Maybe<Scalars['String']>;
  vorname: Scalars['String'];
  geburtsdatum?: Maybe<Scalars['Date']>;
  geschlecht: Gender;
  versicherungsnummer?: Maybe<Scalars['String']>;
  geburtsort?: Maybe<Scalars['String']>;
  familienstand?: Maybe<Scalars['String']>;
  schwerbehindert?: Maybe<Scalars['Boolean']>;
  iban: Scalars['String'];
  bic: Scalars['String'];
  eintrittsdatum: Scalars['Date'];
  ersteintrittsdatum: Scalars['Date'];
  betriebsstaette: Scalars['String'];
  berufsbezeichnung: Scalars['String'];
  ausgeuebte_taetigkeit: Scalars['String'];
  beschaeftigungsart: EmployeeBeschaeftigungsart;
  probezeit: Scalars['Boolean'];
  probezeit_dauer?: Maybe<Scalars['String']>;
  weitere_beschaeftigungen: Scalars['Boolean'];
  ist_weitere_beschaeftigung_geringfuegig: Scalars['Boolean'];
  hoechster_schullabschluss: EmployeeSchulabschluss;
  hoechste_berufsausbildung: EmployeeBerufsausbildung;
  beginn_der_ausbildung?: Maybe<Scalars['Date']>;
  voraussichtliches_ende_der_ausbildung?: Maybe<Scalars['Date']>;
  im_baugewerbe_seit?: Maybe<Scalars['Date']>;
  woechentliche_arbeitszeit: EmployeeWoechentlicheArbeitszeit;
  verteilung_der_woechentlichen_arbeitszeit?: Maybe<Scalars['JSON']>;
  urlaubsanspruch: Scalars['Int'];
  ist_befristet: Scalars['Boolean'];
  ist_zweckbefristet: Scalars['Boolean'];
  befristung_arbeitsvertrag_zum?: Maybe<Scalars['Date']>;
  schrieftlicher_abschluss_des_befristeten_arbeitsvertrages: Scalars['Boolean'];
  abschluss_arbeitsvertrag_am?: Maybe<Scalars['Date']>;
  befristet_mit_aussicht: Scalars['Boolean'];
  ich_wiederspreche_bea_an_bafa: Scalars['Boolean'];
  identifikationsnummer: Scalars['String'];
  finanzamt_nummer: Scalars['String'];
  steuerklasse_faktor: Scalars['String'];
  kinderfreibetraege?: Maybe<Scalars['String']>;
  konfession?: Maybe<Scalars['String']>;
  gesetzliche_krankenkasse: Scalars['String'];
  elterneigenschaft: Scalars['Boolean'];
  entl_bezeichnung?: Maybe<Scalars['String']>;
  entl_betrag?: Maybe<Scalars['Float']>;
  entl_gueltig_ab?: Maybe<Scalars['Date']>;
  stundenlohn?: Maybe<Scalars['Float']>;
  stundenlohn_gueltig_ab?: Maybe<Scalars['Date']>;
  vwl_empfaenger?: Maybe<Scalars['String']>;
  vwl_betrag?: Maybe<Scalars['Float']>;
  vwl_ag_anteil?: Maybe<Scalars['Float']>;
  vwl_seit_wann?: Maybe<Scalars['Date']>;
  vwl_vertragsnummer?: Maybe<Scalars['String']>;
  vwl_iban?: Maybe<Scalars['String']>;
  vwl_bic?: Maybe<Scalars['String']>;
  steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr?: Maybe<Scalars['JSON']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  location?: Maybe<Location>;
  vacations: Array<Vacation>;
  vacation_capacities: Array<VacationCapacity>;
  sicknesses: Array<Sickness>;
  histories: Array<History>;
  documents: Array<Document>;
  staatsangehoerigkeit: Array<Nationality>;
};

export enum EmployeeBerufsausbildung {
  /** Ohne */
  Ohne = 'OHNE',
  /** Anerkannte */
  Anerkannte = 'ANERKANNTE',
  /** Meister technicker */
  MeisterTechnicker = 'MEISTER_TECHNICKER',
  /** Bachelor */
  Bachelor = 'BACHELOR',
  /** Diplom magister master staatsexamem */
  DiplomMagisterMasterStaatsexamem = 'DIPLOM_MAGISTER_MASTER_STAATSEXAMEM',
  /** Promotion */
  Promotion = 'PROMOTION'
}

export enum EmployeeBeschaeftigungsart {
  /** Hauptbeschaeftigung */
  Hauptbeschaeftigung = 'HAUPTBESCHAEFTIGUNG',
  /** Nebenbeschaeftigung */
  Nebenbeschaeftigung = 'NEBENBESCHAEFTIGUNG'
}

/** A paginated list of Employee items. */
export type EmployeePaginator = {
  __typename?: 'EmployeePaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Employee items. */
  data: Array<Employee>;
};

export enum EmployeeSchulabschluss {
  /** Ohne */
  Ohne = 'OHNE',
  /** Haupt volks */
  HauptVolks = 'HAUPT_VOLKS',
  /** Mittlere reife */
  MittlereReife = 'MITTLERE_REIFE',
  /** Abitur */
  Abitur = 'ABITUR'
}

export enum EmployeeWoechentlicheArbeitszeit {
  /** Vollzeit */
  Vollzeit = 'VOLLZEIT',
  /** Teilzeit */
  Teilzeit = 'TEILZEIT'
}

export type Event = {
  __typename?: 'Event';
  id: Scalars['ObfId'];
  group: EventGroup;
  type?: Maybe<EventType>;
  notes?: Maybe<Scalars['String']>;
  happened_at: Scalars['DateTime'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  eventable?: Maybe<Eventable>;
  project?: Maybe<Project>;
  user?: Maybe<User>;
};

export type Eventable = Client | Candidate | Company;

export enum EventGroup {
  /** Contact */
  Contact = 'CONTACT',
  /** Meeting */
  Meeting = 'MEETING',
  /** Interview */
  Interview = 'INTERVIEW',
  /** Offer */
  Offer = 'OFFER',
  /** Client interview */
  ClientInterview = 'CLIENT_INTERVIEW',
  /** Like */
  Like = 'LIKE',
  /** Unlike */
  Unlike = 'UNLIKE',
  /** Reject */
  Reject = 'REJECT',
  /** On hold */
  OnHold = 'ON_HOLD',
  /** Reactivated */
  Reactivated = 'REACTIVATED'
}

export enum EventType {
  /** Telephone */
  Telephone = 'Telephone',
  /** Email */
  Email = 'Email',
  /** Linked in */
  LinkedIn = 'LinkedIn',
  /** Xing */
  Xing = 'XING',
  /** Video call */
  VideoCall = 'Video_call',
  /** Whats app */
  WhatsApp = 'WhatsApp',
  /** Sms */
  Sms = 'SMS',
  /** Office  ffm */
  OfficeFfm = 'Office_Ffm',
  /** Office  client */
  OfficeClient = 'Office_Client',
  /** Lunch */
  Lunch = 'Lunch',
  /** Dinner */
  Dinner = 'Dinner',
  /** Virtual */
  Virtual = 'Virtual',
  /** F2f */
  F2F = 'F2F',
  /** First interview */
  FirstInterview = 'First_interview',
  /** Second interview */
  SecondInterview = 'Second_interview',
  /** Additional interview */
  AdditionalInterview = 'Additional_interview',
  /** Assessment center */
  AssessmentCenter = 'Assessment_center',
  /** Final interview */
  FinalInterview = 'Final_interview',
  /** Under offer */
  UnderOffer = 'Under_offer',
  /** Accepted */
  Accepted = 'Accepted',
  /** Rejected */
  Rejected = 'Rejected',
  /** By client */
  ByClient = 'By_client',
  /** By candidate */
  ByCandidate = 'By_candidate',
  /** By  blackbull */
  ByBlackbull = 'By_Blackbull'
}

export type FirstAndLastname = {
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
};

export enum Gender {
  /** Male */
  Male = 'Male',
  /** Female */
  Female = 'Female',
  /** Diverse */
  Diverse = 'Diverse'
}

export type History = {
  __typename?: 'History';
  id: Scalars['ID'];
  historiable_type: Scalars['String'];
  user?: Maybe<User>;
  action: HistoryAction;
  changes?: Maybe<Scalars['JSON']>;
  changed_model?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export enum HistoryAction {
  /** Created */
  Created = 'CREATED',
  /** Updated */
  Updated = 'UPDATED',
  /** Deleted */
  Deleted = 'DELETED',
  /** Restored */
  Restored = 'RESTORED',
  /** Force deleted */
  ForceDeleted = 'FORCE_DELETED',
  /** Attached */
  Attached = 'ATTACHED',
  /** Detached */
  Detached = 'DETACHED'
}

export type Image = {
  __typename?: 'Image';
  id: Scalars['ObfId'];
  original_image: Scalars['String'];
  sizes: ImageSizes;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type ImageSizeFormat = {
  __typename?: 'ImageSizeFormat';
  regular: Scalars['String'];
  retina: Scalars['String'];
  thumbnail: Scalars['String'];
  cropProps?: Maybe<CropProps>;
};

export type ImageSizes = {
  __typename?: 'ImageSizes';
  PROFILE_IMAGE?: Maybe<ImageSizeFormat>;
  CH_ARTICLE_AUTHOR?: Maybe<ImageSizeFormat>;
  CH_PODCAST_THUMB?: Maybe<ImageSizeFormat>;
  CH_PODCAST_FULL?: Maybe<ImageSizeFormat>;
  CH_ARTICLE_THUMB?: Maybe<ImageSizeFormat>;
  CH_ARTICLE_FULL?: Maybe<ImageSizeFormat>;
  CH_ARTICLE_IMAGE_INSIDE?: Maybe<ImageSizeFormat>;
};

export type Industry = {
  __typename?: 'Industry';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  is_reviewed: Scalars['Boolean'];
  parent_id?: Maybe<Scalars['ObfId']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  synonyms: Array<Industry>;
  synonym_representative?: Maybe<Industry>;
  parent?: Maybe<Industry>;
  children: Array<Industry>;
};

/** A paginated list of Industry items. */
export type IndustryPaginator = {
  __typename?: 'IndustryPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Industry items. */
  data: Array<Industry>;
};

export type Institution = {
  __typename?: 'Institution';
  id: Scalars['ObfId'];
  name: Scalars['String'];
  is_reviewed: Scalars['Boolean'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

/** A paginated list of Institution items. */
export type InstitutionPaginator = {
  __typename?: 'InstitutionPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Institution items. */
  data: Array<Institution>;
};

export type ItSkill = {
  __typename?: 'ItSkill';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  is_reviewed: Scalars['Boolean'];
  parent_id?: Maybe<Scalars['ObfId']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  synonyms: Array<ItSkill>;
  synonym_representative?: Maybe<ItSkill>;
  parent?: Maybe<ItSkill>;
  children: Array<ItSkill>;
};

/** A paginated list of ItSkill items. */
export type ItSkillPaginator = {
  __typename?: 'ItSkillPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of ItSkill items. */
  data: Array<ItSkill>;
};

export enum JobLevel {
  /** Member of the supervisory board */
  MemberOfTheSupervisoryBoard = 'MEMBER_OF_THE_SUPERVISORY_BOARD',
  /** Member of the executive board */
  MemberOfTheExecutiveBoard = 'MEMBER_OF_THE_EXECUTIVE_BOARD',
  /** Divisional director */
  DivisionalDirector = 'DIVISIONAL_DIRECTOR',
  /** Department manager */
  DepartmentManager = 'DEPARTMENT_MANAGER',
  /** Team leader */
  TeamLeader = 'TEAM_LEADER',
  /** Senior */
  Senior = 'SENIOR',
  /** Expert */
  Expert = 'EXPERT',
  /** Specialist */
  Specialist = 'SPECIALIST',
  /** Trainee */
  Trainee = 'TRAINEE',
  /** Assistance or support */
  AssistanceOrSupport = 'ASSISTANCE_OR_SUPPORT'
}


export type Language = {
  __typename?: 'Language';
  code: Scalars['String'];
  name: Scalars['String'];
  language_pivot?: Maybe<LanguagePivot>;
};

export enum LanguageLevel {
  /** Basic or advanced */
  BasicOrAdvanced = 'BASIC_OR_ADVANCED',
  /** Fluent */
  Fluent = 'FLUENT',
  /** Business fluent */
  BusinessFluent = 'BUSINESS_FLUENT',
  /** Mother tongue */
  MotherTongue = 'MOTHER_TONGUE'
}

export type LanguagePivot = {
  __typename?: 'LanguagePivot';
  level?: Maybe<LanguageLevel>;
};

export type LanguageRelationInput = {
  id: Scalars['String'];
  level?: Maybe<LanguageLevel>;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ObfId'];
  postal_code?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  house_number?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  full_address?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  long?: Maybe<Scalars['Float']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};


export type Mutation = {
  __typename?: 'Mutation';
  createBucket?: Maybe<Bucket>;
  updateBucket?: Maybe<Bucket>;
  updateBucketAdditional?: Maybe<Bucket>;
  deleteBucket?: Maybe<Bucket>;
  addToBucket?: Maybe<Bucket>;
  removeFromBucket?: Maybe<Bucket>;
  copyBucket?: Maybe<Bucket>;
  createCandidate?: Maybe<Candidate>;
  updateCandidate?: Maybe<Candidate>;
  updateCandidateAdditional?: Maybe<Candidate>;
  updateCandidateDocuments?: Maybe<Candidate>;
  deleteCandidate?: Maybe<Candidate>;
  forceDeleteCandidate?: Maybe<Candidate>;
  restoreCandidate?: Maybe<Candidate>;
  addCandidateToProject?: Maybe<Scalars['String']>;
  addCandidatesToProject?: Maybe<Scalars['String']>;
  removeCandidateFromLonglist?: Maybe<Scalars['String']>;
  removeCandidateFromShortlist?: Maybe<Candidate>;
  moveCandidateToShortlist?: Maybe<Candidate>;
  updateCandidateProjectPivot?: Maybe<Candidate>;
  rejectCandidateByCandidate?: Maybe<CandidateAndEvent>;
  rejectCandidateByClient?: Maybe<CandidateAndEvent>;
  rejectCandidateByBlackbull?: Maybe<CandidateAndEvent>;
  onHoldCandidateInProject?: Maybe<CandidateAndEvent>;
  reactivateCandidateInProject?: Maybe<CandidateAndEvent>;
  thumbUpCandidateByClient?: Maybe<CandidateAndEvent>;
  thumbDownCandidateByClient?: Maybe<CandidateAndEvent>;
  generateCandidateAccountCreationToken?: Maybe<Candidate>;
  createUserForCandidate?: Maybe<User>;
  updateCandidateNotesWithinProject?: Maybe<Candidate>;
  sendConsentToCandidateInProject?: Maybe<CandidateProjectPivot>;
  consentCandidateInProject?: Maybe<CandidateProjectPivot>;
  contradictCandidateInProject?: Maybe<CandidateProjectPivot>;
  createCertification: Certification;
  updateCertification: Certification;
  deleteCertification?: Maybe<Certification>;
  createChArticle?: Maybe<ChArticle>;
  updateChArticle?: Maybe<ChArticle>;
  deleteChArticle?: Maybe<ChArticle>;
  uploadChArticleImage?: Maybe<Scalars['String']>;
  createChCategory?: Maybe<ChCategory>;
  updateChCategory?: Maybe<ChCategory>;
  deleteChCategory?: Maybe<ChCategory>;
  createChPodcast?: Maybe<ChPodcast>;
  updateChPodcast?: Maybe<ChPodcast>;
  updateChPodcastAdditional?: Maybe<ChPodcast>;
  deleteChPodcast?: Maybe<ChPodcast>;
  createClient?: Maybe<Client>;
  updateClient?: Maybe<Client>;
  deleteClient?: Maybe<Client>;
  forceDeleteClient?: Maybe<Client>;
  restoreClient?: Maybe<Client>;
  generateClientAccountCreationToken?: Maybe<Client>;
  createUserForClient?: Maybe<User>;
  createCompany?: Maybe<Company>;
  updateCompany?: Maybe<Company>;
  updateCompanyAdditional?: Maybe<Company>;
  updateCompanyDocuments?: Maybe<Company>;
  deleteCompany?: Maybe<Company>;
  forceDeleteCompany?: Maybe<Company>;
  restoreCompany?: Maybe<Company>;
  transferCandidatesAndClients?: Maybe<Company>;
  createDocumentTag: DocumentTag;
  createEmployee?: Maybe<Employee>;
  updateEmployee?: Maybe<Employee>;
  updateEmployeeDocuments?: Maybe<Employee>;
  deleteEmployee?: Maybe<Employee>;
  forceDeleteEmployee?: Maybe<Employee>;
  restoreEmployee?: Maybe<Employee>;
  createEvent: Event;
  updateEvent?: Maybe<Event>;
  deleteEvent?: Maybe<Event>;
  createIndustry: Industry;
  updateIndustry: Industry;
  deleteIndustry?: Maybe<Industry>;
  createInstitution: Institution;
  updateInstitution: Institution;
  deleteInstitution?: Maybe<Institution>;
  createItSkill: ItSkill;
  updateItSkill: ItSkill;
  deleteItSkill?: Maybe<ItSkill>;
  addNewstickerIgnoredSource?: Maybe<NewstickerIgnoredSource>;
  upsertNewstickerItem?: Maybe<NewstickerItem>;
  deleteNewstickerItem?: Maybe<NewstickerItem>;
  createProject?: Maybe<Project>;
  updateProject?: Maybe<Project>;
  deleteProject?: Maybe<Project>;
  forceDeleteProject?: Maybe<Project>;
  restoreProject?: Maybe<Project>;
  pauseProject?: Maybe<Project>;
  resumeProject?: Maybe<Project>;
  reactivateProject?: Maybe<Project>;
  cancelProject?: Maybe<Project>;
  completeProject?: Maybe<Project>;
  archiveProject?: Maybe<Project>;
  unarchiveProject?: Maybe<Project>;
  generateProjectShareLink: ProjectSharedLink;
  createRevenue?: Maybe<Revenue>;
  updateRevenue?: Maybe<Revenue>;
  deleteRevenue?: Maybe<Revenue>;
  setSetting: Setting;
  generatePublicDocumentLink: SharedLink;
  createSkill: Skill;
  updateSkill: Skill;
  deleteSkill?: Maybe<Skill>;
  login: TokenInfo;
  loginAsUser: TokenInfo;
  logout: Scalars['Boolean'];
  register: TokenInfo;
  requestPasswordResetting: Scalars['String'];
  changeUserPassword: Scalars['String'];
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser?: Maybe<User>;
  createWorkingHours?: Maybe<WorkingHours>;
  updateWorkingHours?: Maybe<WorkingHours>;
  deleteWorkingHours?: Maybe<WorkingHours>;
  submitWorkingHoursRequestToClient: WorkingHours;
  modifyWorkingHoursByClient: WorkingHours;
  approveWorkingHours: WorkingHours;
  declineWorkingHours: WorkingHours;
};


export type MutationCreateBucketArgs = {
  input: CreateBucketInput;
};


export type MutationUpdateBucketArgs = {
  id: Scalars['ObfId'];
  input: UpdateBucketInput;
};


export type MutationUpdateBucketAdditionalArgs = {
  id: Scalars['ObfId'];
  input: UpdateBucketAdditionalInput;
};


export type MutationDeleteBucketArgs = {
  id: Scalars['ObfId'];
};


export type MutationAddToBucketArgs = {
  id: Scalars['ObfId'];
  input: AddToBucketInput;
};


export type MutationRemoveFromBucketArgs = {
  id: Scalars['ObfId'];
  input: AddToBucketInput;
};


export type MutationCopyBucketArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateCandidateArgs = {
  input: CreateCandidateInput;
};


export type MutationUpdateCandidateArgs = {
  id: Scalars['ObfId'];
  input: UpdateCandidateInput;
};


export type MutationUpdateCandidateAdditionalArgs = {
  id: Scalars['ObfId'];
  input: UpdateCandidateAdditionalInput;
};


export type MutationUpdateCandidateDocumentsArgs = {
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
};


export type MutationDeleteCandidateArgs = {
  id: Scalars['ObfId'];
};


export type MutationForceDeleteCandidateArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationRestoreCandidateArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationAddCandidateToProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
};


export type MutationAddCandidatesToProjectArgs = {
  candidateIds: Array<Scalars['ObfId']>;
  projectId: Scalars['ObfId'];
};


export type MutationRemoveCandidateFromLonglistArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
};


export type MutationRemoveCandidateFromShortlistArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
};


export type MutationMoveCandidateToShortlistArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  pivot?: Maybe<CandidateProjectPivotInput>;
};


export type MutationUpdateCandidateProjectPivotArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  pivot?: Maybe<CandidateProjectPivotInput>;
};


export type MutationRejectCandidateByCandidateArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationRejectCandidateByClientArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationRejectCandidateByBlackbullArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationOnHoldCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationReactivateCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationThumbUpCandidateByClientArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationThumbDownCandidateByClientArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationGenerateCandidateAccountCreationTokenArgs = {
  candidate_id: Scalars['ObfId'];
};


export type MutationCreateUserForCandidateArgs = {
  candidate_id: Scalars['ObfId'];
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateCandidateNotesWithinProjectArgs = {
  projectId: Scalars['ObfId'];
  candidateId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationSendConsentToCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
};


export type MutationConsentCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
};


export type MutationContradictCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
};


export type MutationCreateCertificationArgs = {
  input: CreateCertificationInput;
};


export type MutationUpdateCertificationArgs = {
  id: Scalars['ObfId'];
  input: UpdateCertificationInput;
};


export type MutationDeleteCertificationArgs = {
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
};


export type MutationCreateChArticleArgs = {
  input: CreateChArticleInput;
};


export type MutationUpdateChArticleArgs = {
  id: Scalars['ObfId'];
  input: UpdateChArticleInput;
};


export type MutationDeleteChArticleArgs = {
  id: Scalars['ObfId'];
};


export type MutationUploadChArticleImageArgs = {
  file: Scalars['Upload'];
};


export type MutationCreateChCategoryArgs = {
  input: CreateChCategoryInput;
};


export type MutationUpdateChCategoryArgs = {
  id: Scalars['ObfId'];
  input: UpdateChCategoryInput;
};


export type MutationDeleteChCategoryArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateChPodcastArgs = {
  input: CreateChPodcastInput;
};


export type MutationUpdateChPodcastArgs = {
  id: Scalars['ObfId'];
  input: UpdateChPodcastInput;
};


export type MutationUpdateChPodcastAdditionalArgs = {
  id: Scalars['ObfId'];
  input: UpdateChPodcastAdditionalInput;
};


export type MutationDeleteChPodcastArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ObfId'];
  input: UpdateClientInput;
};


export type MutationDeleteClientArgs = {
  id: Scalars['ObfId'];
};


export type MutationForceDeleteClientArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationRestoreClientArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationGenerateClientAccountCreationTokenArgs = {
  client_id: Scalars['ObfId'];
};


export type MutationCreateUserForClientArgs = {
  client_id: Scalars['ObfId'];
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationUpdateCompanyArgs = {
  id: Scalars['ObfId'];
  input: UpdateCompanyInput;
};


export type MutationUpdateCompanyAdditionalArgs = {
  id: Scalars['ObfId'];
  input: UpdateCompanyAdditionalInput;
};


export type MutationUpdateCompanyDocumentsArgs = {
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['ObfId'];
};


export type MutationForceDeleteCompanyArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationRestoreCompanyArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationTransferCandidatesAndClientsArgs = {
  fromCompanyId: Scalars['ObfId'];
  toCompanyId: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationCreateDocumentTagArgs = {
  input: CreateDocumentTagInput;
};


export type MutationCreateEmployeeArgs = {
  input: CreateEmployeeInput;
};


export type MutationUpdateEmployeeArgs = {
  id: Scalars['ObfId'];
  input: UpdateEmployeeInput;
};


export type MutationUpdateEmployeeDocumentsArgs = {
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['ObfId'];
};


export type MutationForceDeleteEmployeeArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationRestoreEmployeeArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationUpdateEventArgs = {
  id: Scalars['ObfId'];
  input: UpdateEventInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateIndustryArgs = {
  input: CreateIndustryInput;
};


export type MutationUpdateIndustryArgs = {
  id: Scalars['ObfId'];
  input: UpdateIndustryInput;
};


export type MutationDeleteIndustryArgs = {
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
};


export type MutationCreateInstitutionArgs = {
  input: CreateInstitutionInput;
};


export type MutationUpdateInstitutionArgs = {
  id: Scalars['ObfId'];
  input: UpdateInstitutionInput;
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
};


export type MutationCreateItSkillArgs = {
  input: CreateItSkillInput;
};


export type MutationUpdateItSkillArgs = {
  id: Scalars['ObfId'];
  input: UpdateItSkillInput;
};


export type MutationDeleteItSkillArgs = {
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
};


export type MutationAddNewstickerIgnoredSourceArgs = {
  name: Scalars['String'];
};


export type MutationUpsertNewstickerItemArgs = {
  input: UpsertNewstickerItemInput;
};


export type MutationDeleteNewstickerItemArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ObfId'];
  input: UpdateProjectInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ObfId'];
};


export type MutationForceDeleteProjectArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationRestoreProjectArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type MutationPauseProjectArgs = {
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationResumeProjectArgs = {
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationReactivateProjectArgs = {
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationCancelProjectArgs = {
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
  cancelled_by: ProjectCanceller;
};


export type MutationCompleteProjectArgs = {
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
};


export type MutationArchiveProjectArgs = {
  id: Scalars['ObfId'];
};


export type MutationUnarchiveProjectArgs = {
  id: Scalars['ObfId'];
};


export type MutationGenerateProjectShareLinkArgs = {
  project_id: Scalars['ObfId'];
  password?: Maybe<Scalars['String']>;
  expires_after_days: Scalars['Int'];
  is_longlist_shared?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateRevenueArgs = {
  input: CreateRevenueInput;
};


export type MutationUpdateRevenueArgs = {
  id: Scalars['ObfId'];
  input: UpdateRevenueInput;
};


export type MutationDeleteRevenueArgs = {
  id: Scalars['ObfId'];
};


export type MutationSetSettingArgs = {
  key: Scalars['String'];
  value?: Maybe<Scalars['JSON']>;
};


export type MutationGeneratePublicDocumentLinkArgs = {
  document_id: Scalars['ObfId'];
  expires_after_days: Scalars['Int'];
};


export type MutationCreateSkillArgs = {
  input: CreateSkillInput;
};


export type MutationUpdateSkillArgs = {
  id: Scalars['ObfId'];
  input: UpdateSkillInput;
};


export type MutationDeleteSkillArgs = {
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginAsUserArgs = {
  userId: Scalars['ObfId'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
};


export type MutationRequestPasswordResettingArgs = {
  email: Scalars['String'];
};


export type MutationChangeUserPasswordArgs = {
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ObfId'];
  input: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ObfId'];
};


export type MutationCreateWorkingHoursArgs = {
  input: CreateWorkingHoursInput;
};


export type MutationUpdateWorkingHoursArgs = {
  input: UpdateWorkingHoursInput;
};


export type MutationDeleteWorkingHoursArgs = {
  id: Scalars['ObfId'];
};


export type MutationSubmitWorkingHoursRequestToClientArgs = {
  input: UpdateWorkingHoursInput;
};


export type MutationModifyWorkingHoursByClientArgs = {
  input: UpdateWorkingHoursInput;
};


export type MutationApproveWorkingHoursArgs = {
  id: Scalars['ObfId'];
  status_note?: Maybe<Scalars['String']>;
};


export type MutationDeclineWorkingHoursArgs = {
  id: Scalars['ObfId'];
  status_note?: Maybe<Scalars['String']>;
};

export type Nationality = {
  __typename?: 'Nationality';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type NationalityRelationInput = {
  id: Scalars['String'];
};

export type NewstickerIgnoredSource = {
  __typename?: 'NewstickerIgnoredSource';
  id: Scalars['ObfId'];
  name: Scalars['String'];
};

export type NewstickerItem = {
  __typename?: 'NewstickerItem';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  url: Scalars['String'];
  source: Scalars['String'];
  published_at: Scalars['DateTime'];
  status: NewstickerItemStatus;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

/** A paginated list of NewstickerItem items. */
export type NewstickerItemPaginator = {
  __typename?: 'NewstickerItemPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of NewstickerItem items. */
  data: Array<NewstickerItem>;
};

export enum NewstickerItemStatus {
  /** Pending */
  Pending = 'PENDING',
  /** Published */
  Published = 'PUBLISHED',
  /** Ignored */
  Ignored = 'IGNORED'
}


/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Minimum. */
  Min = 'MIN',
  /** Maximum. */
  Max = 'MAX',
  /** Sum. */
  Sum = 'SUM',
  /** Amount of items. */
  Count = 'COUNT'
}

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars['String']>;
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars['String']>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars['Int'];
  /** Number of nodes in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
  /** Number of items per page. */
  perPage: Scalars['Int'];
  /** Number of total available items. */
  total: Scalars['Int'];
};

export type Person = {
  __typename?: 'Person';
  id: Scalars['ObfId'];
  title?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  other_firstnames?: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  birth_name?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  birthdate?: Maybe<Scalars['Date']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  candidate_id?: Maybe<Scalars['ObfId']>;
  client_id?: Maybe<Scalars['ObfId']>;
  full_name: Scalars['String'];
  foto?: Maybe<Image>;
  histories: Array<History>;
  candidate?: Maybe<Candidate>;
  client?: Maybe<Client>;
};

export type Phonenumber = {
  __typename?: 'Phonenumber';
  id: Scalars['ObfId'];
  country_code: Scalars['String'];
  dial_code: Scalars['String'];
  number: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ObfId'];
  status: ProjectStatus;
  status_note?: Maybe<Scalars['String']>;
  is_interim: Scalars['Boolean'];
  is_permanent: Scalars['Boolean'];
  title: Scalars['String'];
  max_basic_salary?: Maybe<Scalars['Float']>;
  max_bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  fee_structure?: Maybe<Scalars['Int']>;
  max_daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  retain?: Maybe<Scalars['Float']>;
  project_start?: Maybe<Scalars['Date']>;
  project_end?: Maybe<Scalars['Date']>;
  placed_start_at?: Maybe<Scalars['Date']>;
  notes?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  deleted_at?: Maybe<Scalars['DateTime']>;
  archived_at?: Maybe<Scalars['DateTime']>;
  candidates_count?: Maybe<Scalars['Int']>;
  shortlisted_candidates_count?: Maybe<Scalars['Int']>;
  ir_name?: Maybe<Scalars['String']>;
  ir_email?: Maybe<Scalars['String']>;
  ir_phone?: Maybe<Scalars['String']>;
  ir_vat?: Maybe<Scalars['String']>;
  ir_po?: Maybe<Scalars['String']>;
  ir_address?: Maybe<Scalars['String']>;
  company: Company;
  clients: Array<Client>;
  users: Array<User>;
  candidates: Array<Candidate>;
  placed_candidate?: Maybe<Candidate>;
  shortlisted_candidates: Array<Candidate>;
  candidate?: Maybe<Candidate>;
  histories: Array<History>;
  industries: Array<Industry>;
  skills: Array<Skill>;
  certifications: Array<Certification>;
  it_skills: Array<ItSkill>;
  languages: Array<Language>;
  documents: Array<Document>;
  shared_links: Array<ProjectSharedLink>;
  current_shared_link?: Maybe<ProjectSharedLink>;
  client_events: Array<Event>;
  revenues: Array<Revenue>;
  pivot?: Maybe<ProjectUserPivot>;
  candidate_project_pivot?: Maybe<CandidateProjectPivot>;
  client_project_pivot?: Maybe<ClientProjectPivot>;
  bucket_project_pivot?: Maybe<BucketMorphItemPivot>;
};


export type ProjectCandidateArgs = {
  candidate_id: Scalars['ObfId'];
};

export enum ProjectCanceller {
  /** Client */
  Client = 'CLIENT',
  /** Blackbull */
  Blackbull = 'BLACKBULL'
}

/** A paginated list of Project items. */
export type ProjectPaginator = {
  __typename?: 'ProjectPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Project items. */
  data: Array<Project>;
};

export type ProjectsFilter = {
  title?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['ObfId']>;
  with_archived?: Maybe<Scalars['Boolean']>;
  statuses?: Maybe<Array<ProjectStatus>>;
  industries?: Maybe<Array<Scalars['ObfId']>>;
  skills?: Maybe<Array<Scalars['ObfId']>>;
  daily_rate_min?: Maybe<Scalars['Float']>;
  daily_rate_max?: Maybe<Scalars['Float']>;
  salary_package_min?: Maybe<Scalars['Float']>;
  salary_package_max?: Maybe<Scalars['Float']>;
  project_start_from?: Maybe<Scalars['Date']>;
  project_start_till?: Maybe<Scalars['Date']>;
};

export type ProjectSharedLink = {
  __typename?: 'ProjectSharedLink';
  token: Scalars['String'];
  password: Scalars['String'];
  expires_at: Scalars['Date'];
  guest_accesses: Scalars['Int'];
  is_longlist_shared: Scalars['Boolean'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  project: Project;
};

export enum ProjectStatus {
  /** Active */
  Active = 'ACTIVE',
  /** Paused */
  Paused = 'PAUSED',
  /** Cancelled by client */
  CancelledByClient = 'CANCELLED_BY_CLIENT',
  /** Cancelled by blackbull */
  CancelledByBlackbull = 'CANCELLED_BY_BLACKBULL',
  /** Placed */
  Placed = 'PLACED',
  /** Runner */
  Runner = 'RUNNER',
  /** Completed */
  Completed = 'COMPLETED'
}

export type ProjectUserPivot = {
  __typename?: 'ProjectUserPivot';
  project_id?: Maybe<Scalars['ObfId']>;
  user_id?: Maybe<Scalars['ObfId']>;
  role: Scalars['String'];
  percent: Scalars['Float'];
};

export type ProjectUserRelationInput = {
  id: Scalars['ObfId'];
  role?: Maybe<Scalars['String']>;
  percent?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  bucket?: Maybe<Bucket>;
  exportBucket?: Maybe<Scalars['String']>;
  candidate?: Maybe<Candidate>;
  suitableCandidatesForProject?: Maybe<CandidatePaginator>;
  getCandidateByAccountCreationToken?: Maybe<Candidate>;
  getConsentForCandidateInProject?: Maybe<CandidateProjectPivot>;
  allCertifications: Array<Certification>;
  certification?: Maybe<Certification>;
  chArticles: Array<ChArticle>;
  chArticle?: Maybe<ChArticle>;
  chArticleBySlug?: Maybe<ChArticle>;
  chCategories: Array<ChCategory>;
  chCategory?: Maybe<ChCategory>;
  chCategoryBySlug?: Maybe<ChCategory>;
  chPodcasts: Array<ChPodcast>;
  chPodcast?: Maybe<ChPodcast>;
  chPodcastBySlug?: Maybe<ChPodcast>;
  clientsInCompany: Array<Client>;
  client?: Maybe<Client>;
  getClientByAccountCreationToken?: Maybe<Client>;
  company?: Maybe<Company>;
  getDocumentDownloadLink: Scalars['String'];
  getDocumentPreviewLink: Scalars['String'];
  getDocumentPreviewLinkByToken: Scalars['String'];
  documentTags: Array<DocumentTag>;
  employee?: Maybe<Employee>;
  event?: Maybe<Event>;
  allIndustries: Array<Industry>;
  industry?: Maybe<Industry>;
  allInstitutions: Array<Institution>;
  institution?: Maybe<Institution>;
  allItSkills: Array<ItSkill>;
  itSkill?: Maybe<ItSkill>;
  languages?: Maybe<Array<Language>>;
  nationalities?: Maybe<Array<Nationality>>;
  newstickerIgnoredSources?: Maybe<NewstickerIgnoredSource>;
  newstickerItem?: Maybe<NewstickerItem>;
  people: Array<Person>;
  getProjectByToken?: Maybe<Project>;
  allProjects: Array<Project>;
  projectsForAutocompleteForLonglist: Array<Project>;
  project?: Maybe<Project>;
  revenue?: Maybe<Revenue>;
  revenueChartData: Array<RevenueChart>;
  revenueChartDataSum: Array<RevenueChart>;
  setting?: Maybe<Setting>;
  getSharedLinksOfDocument: Array<SharedLink>;
  allSkills: Array<Skill>;
  skill?: Maybe<Skill>;
  license?: Maybe<StellaLicense>;
  usersCount: Scalars['Int'];
  user?: Maybe<User>;
  usersStatsCount: Array<UserStatsCount>;
  isResetPasswordTokenValid: Scalars['Boolean'];
  workingHours?: Maybe<WorkingHours>;
  candidates?: Maybe<CandidatePaginator>;
  certifications?: Maybe<CertificationPaginator>;
  clients?: Maybe<ClientPaginator>;
  companies?: Maybe<CompanyPaginator>;
  employees?: Maybe<EmployeePaginator>;
  industries?: Maybe<IndustryPaginator>;
  institutions?: Maybe<InstitutionPaginator>;
  itSkills?: Maybe<ItSkillPaginator>;
  newstickerItems?: Maybe<NewstickerItemPaginator>;
  projects?: Maybe<ProjectPaginator>;
  revenues?: Maybe<RevenuePaginator>;
  skills?: Maybe<SkillPaginator>;
  users?: Maybe<UserPaginator>;
};


export type QueryBucketArgs = {
  id: Scalars['ObfId'];
};


export type QueryExportBucketArgs = {
  id: Scalars['ObfId'];
  candidateColumns: Array<Scalars['String']>;
  clientColumns: Array<Scalars['String']>;
  companyColumns: Array<Scalars['String']>;
  projectColumns: Array<Scalars['String']>;
};


export type QueryCandidateArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type QuerySuitableCandidatesForProjectArgs = {
  project_id: Scalars['ObfId'];
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
};


export type QueryGetCandidateByAccountCreationTokenArgs = {
  candidate_id: Scalars['ObfId'];
  token: Scalars['String'];
};


export type QueryGetConsentForCandidateInProjectArgs = {
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
};


export type QueryAllCertificationsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QueryCertificationArgs = {
  id: Scalars['ObfId'];
};


export type QueryChArticlesArgs = {
  orderBy?: Maybe<Array<QueryChArticlesOrderByOrderByClause>>;
};


export type QueryChArticleArgs = {
  id: Scalars['ObfId'];
};


export type QueryChArticleBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryChCategoriesArgs = {
  orderBy?: Maybe<Array<QueryChCategoriesOrderByOrderByClause>>;
};


export type QueryChCategoryArgs = {
  id: Scalars['ObfId'];
};


export type QueryChCategoryBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryChPodcastsArgs = {
  orderBy?: Maybe<Array<QueryChPodcastsOrderByOrderByClause>>;
};


export type QueryChPodcastArgs = {
  id: Scalars['ObfId'];
};


export type QueryChPodcastBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryClientsInCompanyArgs = {
  company_id: Scalars['ObfId'];
};


export type QueryClientArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type QueryGetClientByAccountCreationTokenArgs = {
  client_id: Scalars['ObfId'];
  token: Scalars['String'];
};


export type QueryCompanyArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type QueryGetDocumentDownloadLinkArgs = {
  id: Scalars['ObfId'];
};


export type QueryGetDocumentPreviewLinkArgs = {
  id: Scalars['ObfId'];
};


export type QueryGetDocumentPreviewLinkByTokenArgs = {
  id: Scalars['ObfId'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type QueryDocumentTagsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QueryEmployeeArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type QueryEventArgs = {
  id: Scalars['ObfId'];
};


export type QueryAllIndustriesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QueryIndustryArgs = {
  id: Scalars['ObfId'];
};


export type QueryAllInstitutionsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QueryInstitutionArgs = {
  id: Scalars['ObfId'];
};


export type QueryAllItSkillsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QueryItSkillArgs = {
  id: Scalars['ObfId'];
};


export type QueryNewstickerIgnoredSourcesArgs = {
  orderBy?: Maybe<Array<QueryNewstickerIgnoredSourcesOrderByOrderByClause>>;
};


export type QueryNewstickerItemArgs = {
  id: Scalars['ObfId'];
};


export type QueryPeopleArgs = {
  names?: Maybe<FirstAndLastname>;
};


export type QueryGetProjectByTokenArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type QueryAllProjectsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  filter?: Maybe<ProjectsFilter>;
  trashed?: Maybe<Trashed>;
};


export type QueryProjectsForAutocompleteForLonglistArgs = {
  candidateId: Scalars['ObfId'];
};


export type QueryProjectArgs = {
  id: Scalars['ObfId'];
  trashed?: Maybe<Trashed>;
};


export type QueryRevenueArgs = {
  id: Scalars['ObfId'];
};


export type QueryRevenueChartDataArgs = {
  userId: Scalars['ObfId'];
  year?: Maybe<Scalars['Int']>;
};


export type QueryRevenueChartDataSumArgs = {
  year?: Maybe<Scalars['Int']>;
};


export type QuerySettingArgs = {
  key: Scalars['String'];
};


export type QueryGetSharedLinksOfDocumentArgs = {
  document_id: Scalars['ObfId'];
};


export type QueryAllSkillsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
};


export type QuerySkillArgs = {
  id: Scalars['ObfId'];
};


export type QueryUsersCountArgs = {
  roles?: Maybe<Array<UserRole>>;
};


export type QueryUserArgs = {
  id: Scalars['ObfId'];
};


export type QueryUsersStatsCountArgs = {
  from: Scalars['DateRequestTz'];
  till: Scalars['DateRequestTz'];
};


export type QueryIsResetPasswordTokenValidArgs = {
  token: Scalars['String'];
};


export type QueryWorkingHoursArgs = {
  id: Scalars['ObfId'];
};


export type QueryCandidatesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  names?: Maybe<FirstAndLastname>;
  anyName?: Maybe<Scalars['String']>;
  filter?: Maybe<CandidatesFilter>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  trashed?: Maybe<Trashed>;
};


export type QueryCertificationsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryClientsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  names?: Maybe<FirstAndLastname>;
  filter?: Maybe<ClientsFilter>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  trashed?: Maybe<Trashed>;
};


export type QueryCompaniesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  name?: Maybe<Scalars['String']>;
  filter?: Maybe<CompaniesFilter>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  trashed?: Maybe<Trashed>;
};


export type QueryEmployeesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  where?: Maybe<QueryEmployeesWhereWhereConditions>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  trashed?: Maybe<Trashed>;
};


export type QueryIndustriesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryInstitutionsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  name?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryItSkillsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryNewstickerItemsArgs = {
  orderBy?: Maybe<Array<QueryNewstickerItemsOrderByOrderByClause>>;
  status?: Maybe<Array<NewstickerItemStatus>>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryProjectsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  filter?: Maybe<ProjectsFilter>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  trashed?: Maybe<Trashed>;
};


export type QueryRevenuesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  filter?: Maybe<RevenuesFilter>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QuerySkillsArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};


export type QueryUsersArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  where?: Maybe<QueryUsersWhereWhereConditions>;
  roles?: Maybe<Array<UserRole>>;
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

/** Allowed column names for Query.chArticles.orderBy. */
export enum QueryChArticlesOrderByColumn {
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT',
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.chArticles.orderBy. */
export type QueryChArticlesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryChArticlesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.chCategories.orderBy. */
export enum QueryChCategoriesOrderByColumn {
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT'
}

/** Order by clause for Query.chCategories.orderBy. */
export type QueryChCategoriesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryChCategoriesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.chPodcasts.orderBy. */
export enum QueryChPodcastsOrderByColumn {
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT',
  CreatedAt = 'CREATED_AT'
}

/** Order by clause for Query.chPodcasts.orderBy. */
export type QueryChPodcastsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryChPodcastsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.employees.where. */
export enum QueryEmployeesWhereColumn {
  Familienname = 'FAMILIENNAME',
  Vorname = 'VORNAME',
  Personalnummer = 'PERSONALNUMMER',
  BetrPersonalnummer = 'BETR_PERSONALNUMMER'
}

/** Dynamic WHERE conditions for the `where` argument on the query `employees`. */
export type QueryEmployeesWhereWhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<QueryEmployeesWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars['Mixed']>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryEmployeesWhereWhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryEmployeesWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryEmployeesWhereWhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `employees`. */
export type QueryEmployeesWhereWhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars['String'];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: Maybe<QueryEmployeesWhereWhereConditions>;
};

/** Allowed column names for Query.newstickerIgnoredSources.orderBy. */
export enum QueryNewstickerIgnoredSourcesOrderByColumn {
  Name = 'NAME'
}

/** Order by clause for Query.newstickerIgnoredSources.orderBy. */
export type QueryNewstickerIgnoredSourcesOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryNewstickerIgnoredSourcesOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.newstickerItems.orderBy. */
export enum QueryNewstickerItemsOrderByColumn {
  PublishedAt = 'PUBLISHED_AT'
}

/** Order by clause for Query.newstickerItems.orderBy. */
export type QueryNewstickerItemsOrderByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryNewstickerItemsOrderByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.users.where. */
export enum QueryUsersWhereColumn {
  Firstname = 'FIRSTNAME',
  Lastname = 'LASTNAME',
  Email = 'EMAIL'
}

/** Dynamic WHERE conditions for the `where` argument on the query `users`. */
export type QueryUsersWhereWhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<QueryUsersWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars['Mixed']>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<QueryUsersWhereWhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<QueryUsersWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<QueryUsersWhereWhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `users`. */
export type QueryUsersWhereWhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars['String'];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: Maybe<QueryUsersWhereWhereConditions>;
};

export type Revenue = {
  __typename?: 'Revenue';
  id: Scalars['ObfId'];
  year: Scalars['Int'];
  month: Scalars['Int'];
  amount: Scalars['BigInt'];
  type: RevenueType;
  stage: RevenueStage;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  project_id: Scalars['ObfId'];
  author_id: Scalars['ObfId'];
  project: Project;
  author: User;
  users: Array<User>;
  revenue_users: Array<RevenueUserPivot>;
};

export type RevenueChart = {
  __typename?: 'RevenueChart';
  id: Scalars['ID'];
  user_id?: Maybe<Scalars['ObfId']>;
  year: Scalars['Int'];
  month: Scalars['Int'];
  stats: RevenueChartBreakout;
};

export type RevenueChartBreakout = {
  __typename?: 'RevenueChartBreakout';
  FORECAST: Scalars['BigInt'];
  READY_TO_INVOICE: Scalars['BigInt'];
  INVOICE_SENT: Scalars['BigInt'];
  PAID: Scalars['BigInt'];
};

/** A paginated list of Revenue items. */
export type RevenuePaginator = {
  __typename?: 'RevenuePaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Revenue items. */
  data: Array<Revenue>;
};

export type RevenuesFilter = {
  search?: Maybe<Scalars['String']>;
  type?: Maybe<RevenueType>;
  stage?: Maybe<RevenueStage>;
  user_id?: Maybe<Scalars['ObfId']>;
  year?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
};

export enum RevenueStage {
  /** Pending or cancelled */
  PendingOrCancelled = 'PENDING_OR_CANCELLED',
  /** Forecast */
  Forecast = 'FORECAST',
  /** Ready to invoice */
  ReadyToInvoice = 'READY_TO_INVOICE',
  /** Invoice sent */
  InvoiceSent = 'INVOICE_SENT',
  /** Paid */
  Paid = 'PAID'
}

export enum RevenueType {
  /** Retainer */
  Retainer = 'RETAINER',
  /** Shortlist fee */
  ShortlistFee = 'SHORTLIST_FEE',
  /** Completion fee */
  CompletionFee = 'COMPLETION_FEE',
  /** Success fee */
  SuccessFee = 'SUCCESS_FEE',
  /** Cancellation fee */
  CancellationFee = 'CANCELLATION_FEE',
  /** Admin fee */
  AdminFee = 'ADMIN_FEE',
  /** Monthly fee */
  MonthlyFee = 'MONTHLY_FEE'
}

export type RevenueUserPivot = {
  __typename?: 'RevenueUserPivot';
  id: Scalars['ID'];
  user_id: Scalars['ObfId'];
  revenue_id: Scalars['ObfId'];
  percent: Scalars['Int'];
  revenue: Revenue;
  user: User;
};

export type RevenueUserRelationInput = {
  id: Scalars['ObfId'];
  percent?: Maybe<Scalars['Float']>;
};

export type Setting = {
  __typename?: 'Setting';
  key: Scalars['String'];
  value?: Maybe<Scalars['JSON']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export type SharedLink = {
  __typename?: 'SharedLink';
  id: Scalars['ObfId'];
  token: Scalars['String'];
  views: Scalars['Int'];
  expires_at: Scalars['DateTime'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  URL: Scalars['String'];
  document: Document;
};

export type Sickness = {
  __typename?: 'Sickness';
  id: Scalars['ObfId'];
  from: Scalars['Date'];
  till: Scalars['Date'];
  days_count: Scalars['Int'];
  status: SicknessStatus;
};

export enum SicknessStatus {
  /** Submitted */
  Submitted = 'SUBMITTED',
  /** Processed */
  Processed = 'PROCESSED'
}

/** Information about pagination using a simple paginator. */
export type SimplePaginatorInfo = {
  __typename?: 'SimplePaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Number of items per page. */
  perPage: Scalars['Int'];
};

export type Skill = {
  __typename?: 'Skill';
  id: Scalars['ObfId'];
  title: Scalars['String'];
  is_reviewed: Scalars['Boolean'];
  parent_id?: Maybe<Scalars['ObfId']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  synonyms: Array<Skill>;
  synonym_representative?: Maybe<Skill>;
  parent?: Maybe<Skill>;
  children: Array<Skill>;
};

/** A paginated list of Skill items. */
export type SkillPaginator = {
  __typename?: 'SkillPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of Skill items. */
  data: Array<Skill>;
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Equal operator (`=`) */
  Eq = 'EQ',
  /** Not equal operator (`!=`) */
  Neq = 'NEQ',
  /** Greater than operator (`>`) */
  Gt = 'GT',
  /** Greater than or equal operator (`>=`) */
  Gte = 'GTE',
  /** Less than operator (`<`) */
  Lt = 'LT',
  /** Less than or equal operator (`<=`) */
  Lte = 'LTE',
  /** Simple pattern matching (`LIKE`) */
  Like = 'LIKE',
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = 'NOT_LIKE',
  /** Whether a value is within a set of values (`IN`) */
  In = 'IN',
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = 'NOT_IN',
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = 'BETWEEN',
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = 'NOT_BETWEEN',
  /** Whether a value is null (`IS NULL`) */
  IsNull = 'IS_NULL',
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = 'IS_NOT_NULL',
  /** Simple pattern matching (`ILIKE`) */
  Ilike = 'ILIKE'
}

export type StellaLicense = {
  __typename?: 'StellaLicense';
  id: Scalars['ObfId'];
  host: Scalars['String'];
  plugins: Array<StellaPlugin>;
  client_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  users_limit: Scalars['Int'];
  is_active: Scalars['Boolean'];
  logo_url?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
};

export enum StellaPlugin {
  /** Corona helpdesk */
  CoronaHelpdesk = 'CORONA_HELPDESK',
  /** Employees */
  Employees = 'EMPLOYEES'
}

export type TokenInfo = {
  __typename?: 'TokenInfo';
  userId: Scalars['Int'];
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateBucketableRelation = {
  sync?: Maybe<Array<BucketableSyncInput>>;
};

export type UpdateBucketAdditionalInput = {
  candidates?: Maybe<UpdateBucketableRelation>;
  clients?: Maybe<UpdateBucketableRelation>;
  companies?: Maybe<UpdateBucketableRelation>;
  projects?: Maybe<UpdateBucketableRelation>;
  shared_with?: Maybe<UpdateBucketPermissionsRelation>;
};

export type UpdateBucketInput = {
  title?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  shared_with?: Maybe<UpdateBucketPermissionsRelation>;
};

export type UpdateBucketPermissionsRelation = {
  sync?: Maybe<Array<BucketPermissionSyncInput>>;
};

export type UpdateCandidateAdditionalInput = {
  companies?: Maybe<UpdateCandidateCompanyRelation>;
};

export type UpdateCandidateChCategoryRelation = {
  sync?: Maybe<Array<CandidateChCategoryRelationInput>>;
};

export type UpdateCandidateCompanyRelation = {
  sync?: Maybe<Array<CandidateCompanyRelationInput>>;
};

export type UpdateCandidateInput = {
  email?: Maybe<Scalars['String']>;
  is_blacklisted?: Maybe<Scalars['Boolean']>;
  blacklisting_reason?: Maybe<Scalars['String']>;
  is_interim?: Maybe<Scalars['Boolean']>;
  is_permanent?: Maybe<Scalars['Boolean']>;
  marital_status?: Maybe<Scalars['String']>;
  skype_name?: Maybe<Scalars['String']>;
  desired_job?: Maybe<Scalars['String']>;
  max_distance_from_home?: Maybe<Scalars['String']>;
  willing_to_travel?: Maybe<Scalars['Int']>;
  available_from?: Maybe<Scalars['Date']>;
  daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  period_of_notice?: Maybe<Scalars['JSON']>;
  basic_salary?: Maybe<Scalars['Float']>;
  bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  other_bonus?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  linked_in_profile?: Maybe<Scalars['String']>;
  xing_profile?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  is_research?: Maybe<Scalars['Boolean']>;
  has_hourly_rate?: Maybe<Scalars['Boolean']>;
  zoom_id?: Maybe<Scalars['String']>;
  person?: Maybe<DefinePersonRelation>;
  location?: Maybe<UpdateLocationRelation>;
  phonenumbers?: Maybe<UpdatePhonenumberRelation>;
  industries?: Maybe<DefineIndustryRelation>;
  skills?: Maybe<DefineSkillRelation>;
  certifications?: Maybe<DefineCertificationRelation>;
  it_skills?: Maybe<DefineItSkillRelation>;
  languages?: Maybe<DefineLanguageRelation>;
  nationalities?: Maybe<DefineNationalityRelation>;
  educations?: Maybe<UpdateEducationRelation>;
};

export type UpdateCertificationInput = {
  title?: Maybe<Scalars['String']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateChArticleInput = {
  title?: Maybe<Scalars['String']>;
  image_copyright?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  author_position?: Maybe<Scalars['String']>;
  author_company?: Maybe<Scalars['String']>;
  image?: Maybe<CroppedImageUpload>;
  author_image?: Maybe<CroppedImageUpload>;
};

export type UpdateChCategoryInput = {
  title?: Maybe<Scalars['String']>;
  short_text?: Maybe<Scalars['String']>;
  long_text?: Maybe<Scalars['String']>;
  candidates?: Maybe<UpdateCandidateChCategoryRelation>;
};

export type UpdateChPodcastAdditionalInput = {
  audio?: Maybe<Scalars['Upload']>;
};

export type UpdateChPodcastInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  rss_title?: Maybe<Scalars['String']>;
  rss_description?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  category?: Maybe<Scalars['String']>;
  image?: Maybe<CroppedImageUpload>;
};

export type UpdateClientInput = {
  email?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['ObfId']>;
  location_id?: Maybe<Scalars['ObfId']>;
  need_review_after_autocomplete?: Maybe<Scalars['Boolean']>;
  notes?: Maybe<Scalars['String']>;
  is_research?: Maybe<Scalars['Boolean']>;
  zoom_id?: Maybe<Scalars['String']>;
  person?: Maybe<DefinePersonRelation>;
  phonenumbers?: Maybe<UpdatePhonenumberRelation>;
};

export type UpdateCompanyAdditionalInput = {
  sync_clients?: Maybe<Array<Scalars['ObfId']>>;
  /** Enter an ID to overwrite to new parent relation. Enter null to dissociate relation */
  parent_company_id?: Maybe<Scalars['ObfId']>;
  /** Sync children companies. Only given IDs will be associated to current company. All others will be dissociated! */
  sync_children_company?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateCompanyInput = {
  name?: Maybe<Scalars['String']>;
  legal_form?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  employees_count?: Maybe<Scalars['String']>;
  annual_sales?: Maybe<Scalars['Float']>;
  about?: Maybe<Scalars['String']>;
  need_review_after_autocomplete?: Maybe<Scalars['Boolean']>;
  jobs_external_link?: Maybe<Scalars['String']>;
  invoice_notes?: Maybe<Scalars['String']>;
  industries?: Maybe<DefineIndustryRelation>;
  locations?: Maybe<UpdateLocationsRelation>;
  phonenumbers?: Maybe<UpdatePhonenumberRelation>;
  logo?: Maybe<CroppedImageUpload>;
};

export type UpdateDocumentInput = {
  id: Scalars['ObfId'];
  title?: Maybe<Scalars['String']>;
  tags?: Maybe<DefineDocumentTagRelation>;
};

export type UpdateDocumentsRelationInput = {
  create?: Maybe<Array<CreateDocumentInput>>;
  update?: Maybe<Array<UpdateDocumentInput>>;
  delete?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateEducationRelation = {
  sync?: Maybe<Array<EducationRelationInput>>;
};

export type UpdateEmployeeInput = {
  user_id?: Maybe<Scalars['ObfId']>;
  personalnummer?: Maybe<Scalars['String']>;
  betr_personalnummer?: Maybe<Scalars['String']>;
  familienname?: Maybe<Scalars['String']>;
  geburtsname?: Maybe<Scalars['String']>;
  vorname?: Maybe<Scalars['String']>;
  geburtsdatum?: Maybe<Scalars['Date']>;
  geschlecht?: Maybe<Gender>;
  versicherungsnummer?: Maybe<Scalars['String']>;
  geburtsort?: Maybe<Scalars['String']>;
  familienstand?: Maybe<Scalars['String']>;
  schwerbehindert?: Maybe<Scalars['Boolean']>;
  iban?: Maybe<Scalars['String']>;
  bic?: Maybe<Scalars['String']>;
  eintrittsdatum?: Maybe<Scalars['Date']>;
  ersteintrittsdatum?: Maybe<Scalars['Date']>;
  betriebsstaette?: Maybe<Scalars['String']>;
  berufsbezeichnung?: Maybe<Scalars['String']>;
  ausgeuebte_taetigkeit?: Maybe<Scalars['String']>;
  beschaeftigungsart?: Maybe<EmployeeBeschaeftigungsart>;
  probezeit?: Maybe<Scalars['Boolean']>;
  probezeit_dauer?: Maybe<Scalars['String']>;
  weitere_beschaeftigungen?: Maybe<Scalars['Boolean']>;
  ist_weitere_beschaeftigung_geringfuegig?: Maybe<Scalars['Boolean']>;
  hoechster_schullabschluss?: Maybe<EmployeeSchulabschluss>;
  hoechste_berufsausbildung?: Maybe<EmployeeBerufsausbildung>;
  beginn_der_ausbildung?: Maybe<Scalars['Date']>;
  voraussichtliches_ende_der_ausbildung?: Maybe<Scalars['Date']>;
  im_baugewerbe_seit?: Maybe<Scalars['Date']>;
  woechentliche_arbeitszeit?: Maybe<EmployeeWoechentlicheArbeitszeit>;
  verteilung_der_woechentlichen_arbeitszeit?: Maybe<Scalars['JSON']>;
  urlaubsanspruch?: Maybe<Scalars['Int']>;
  ist_befristet?: Maybe<Scalars['Boolean']>;
  ist_zweckbefristet?: Maybe<Scalars['Boolean']>;
  befristung_arbeitsvertrag_zum?: Maybe<Scalars['Date']>;
  schrieftlicher_abschluss_des_befristeten_arbeitsvertrages?: Maybe<Scalars['Boolean']>;
  abschluss_arbeitsvertrag_am?: Maybe<Scalars['Date']>;
  befristet_mit_aussicht?: Maybe<Scalars['Boolean']>;
  ich_wiederspreche_bea_an_bafa?: Maybe<Scalars['Boolean']>;
  identifikationsnummer?: Maybe<Scalars['String']>;
  finanzamt_nummer?: Maybe<Scalars['String']>;
  steuerklasse_faktor?: Maybe<Scalars['String']>;
  kinderfreibetraege?: Maybe<Scalars['String']>;
  konfession?: Maybe<Scalars['String']>;
  gesetzliche_krankenkasse?: Maybe<Scalars['String']>;
  elterneigenschaft?: Maybe<Scalars['Boolean']>;
  entl_bezeichnung?: Maybe<Scalars['String']>;
  entl_betrag?: Maybe<Scalars['Float']>;
  entl_gueltig_ab?: Maybe<Scalars['Date']>;
  stundenlohn?: Maybe<Scalars['Float']>;
  stundenlohn_gueltig_ab?: Maybe<Scalars['Date']>;
  vwl_empfaenger?: Maybe<Scalars['String']>;
  vwl_betrag?: Maybe<Scalars['Float']>;
  vwl_ag_anteil?: Maybe<Scalars['Float']>;
  vwl_seit_wann?: Maybe<Scalars['Date']>;
  vwl_vertragsnummer?: Maybe<Scalars['String']>;
  vwl_iban?: Maybe<Scalars['String']>;
  vwl_bic?: Maybe<Scalars['String']>;
  steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr?: Maybe<Scalars['JSON']>;
  location?: Maybe<UpdateLocationRelation>;
  staatsangehoerigkeit?: Maybe<DefineNationalityRelation>;
};

export type UpdateEventInput = {
  group: EventGroup;
  type: EventType;
  notes?: Maybe<Scalars['String']>;
  happened_at: Scalars['DateTime'];
};

export type UpdateIndustryInput = {
  title?: Maybe<Scalars['String']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateInstitutionInput = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateItSkillInput = {
  title?: Maybe<Scalars['String']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateLocationInput = {
  id: Scalars['ObfId'];
  postal_code?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  house_number?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  full_address?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  long?: Maybe<Scalars['Float']>;
};

export type UpdateLocationRelation = {
  create?: Maybe<CreateLocationInput>;
  update?: Maybe<UpdateLocationInput>;
  delete?: Maybe<Scalars['ObfId']>;
};

export type UpdateLocationsRelation = {
  create?: Maybe<Array<CreateLocationInput>>;
  update?: Maybe<Array<UpdateLocationInput>>;
  delete?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdatePhonenumberInput = {
  id: Scalars['ObfId'];
  country_code?: Maybe<Scalars['String']>;
  dial_code?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type UpdatePhonenumberRelation = {
  create?: Maybe<Array<CreatePhonenumberInput>>;
  update?: Maybe<Array<UpdatePhonenumberInput>>;
  delete?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateProjectInput = {
  is_interim?: Maybe<Scalars['Boolean']>;
  is_permanent?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  max_basic_salary?: Maybe<Scalars['Float']>;
  max_bonus_eur?: Maybe<Scalars['Float']>;
  is_business_car_included?: Maybe<Scalars['Boolean']>;
  fee_structure?: Maybe<Scalars['Int']>;
  max_daily_rate?: Maybe<Scalars['Float']>;
  expenses_included?: Maybe<Scalars['Boolean']>;
  retain?: Maybe<Scalars['Float']>;
  project_start?: Maybe<Scalars['Date']>;
  project_end?: Maybe<Scalars['Date']>;
  placed_start_at?: Maybe<Scalars['Date']>;
  notes?: Maybe<Scalars['String']>;
  ir_name?: Maybe<Scalars['String']>;
  ir_email?: Maybe<Scalars['String']>;
  ir_phone?: Maybe<Scalars['String']>;
  ir_vat?: Maybe<Scalars['String']>;
  ir_po?: Maybe<Scalars['String']>;
  ir_address?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['ObfId']>;
  clients?: Maybe<DefineClientRelation>;
  industries?: Maybe<DefineIndustryRelation>;
  skills?: Maybe<DefineSkillRelation>;
  certifications?: Maybe<DefineCertificationRelation>;
  it_skills?: Maybe<DefineItSkillRelation>;
  languages?: Maybe<DefineLanguageRelation>;
  users?: Maybe<UpdateProjectUserRelation>;
  documents?: Maybe<UpdateDocumentsRelationInput>;
};

export type UpdateProjectUserRelation = {
  sync?: Maybe<Array<ProjectUserRelationInput>>;
};

export type UpdateRevenueInput = {
  year?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  amount?: Maybe<Scalars['BigInt']>;
  type?: Maybe<RevenueType>;
  stage?: Maybe<RevenueStage>;
  users?: Maybe<UpdateRevenueUserRelation>;
};

export type UpdateRevenueUserRelation = {
  sync?: Maybe<Array<RevenueUserRelationInput>>;
};

export type UpdateSkillInput = {
  title?: Maybe<Scalars['String']>;
  synonym_representative_id?: Maybe<Scalars['ObfId']>;
  parent_id?: Maybe<Scalars['ObfId']>;
  children_ids?: Maybe<Array<Scalars['ObfId']>>;
};

export type UpdateUserInput = {
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<UserRole>>;
  password?: Maybe<Scalars['String']>;
  contact_email?: Maybe<Scalars['String']>;
  contact_number?: Maybe<Scalars['String']>;
  foto?: Maybe<CroppedImageUpload>;
};

export type UpdateWorkingHoursInput = {
  id: Scalars['ObfId'];
  units?: Maybe<Array<WorkingHoursUnitInput>>;
  status_note?: Maybe<Scalars['String']>;
};


export type UpsertNewstickerItemInput = {
  id?: Maybe<Scalars['ObfId']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['DateTime']>;
  status?: Maybe<NewstickerItemStatus>;
};

export type UpsertPersonInput = {
  id?: Maybe<Scalars['ObfId']>;
  title?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  other_firstnames?: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  birth_name?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  birthdate?: Maybe<Scalars['Date']>;
  foto?: Maybe<CroppedImageUpload>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ObfId']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  roles: Array<UserRole>;
  contact_email?: Maybe<Scalars['String']>;
  contact_number?: Maybe<Scalars['String']>;
  projects: Array<Project>;
  revenues: Array<Revenue>;
  events: Array<Event>;
  buckets: Array<Bucket>;
  shared_buckets: Array<Bucket>;
  candidate?: Maybe<Candidate>;
  client?: Maybe<Client>;
  foto?: Maybe<Image>;
  pivot?: Maybe<ProjectUserPivot>;
  bucket_user_permission?: Maybe<BucketUserPermission>;
  stats: UserStats;
};


export type UserRevenuesArgs = {
  where?: Maybe<UserRevenuesWhereWhereConditions>;
};


export type UserEventsArgs = {
  onlyDay?: Maybe<Scalars['DateRequestTz']>;
};


export type UserStatsArgs = {
  from: Scalars['DateRequestTz'];
  till: Scalars['DateRequestTz'];
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of User items. */
  data: Array<User>;
};

/** Allowed column names for User.revenues.where. */
export enum UserRevenuesWhereColumn {
  Year = 'YEAR',
  Month = 'MONTH'
}

/** Dynamic WHERE conditions for the `where` argument on the query `revenues`. */
export type UserRevenuesWhereWhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<UserRevenuesWhereColumn>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars['Mixed']>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<UserRevenuesWhereWhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<UserRevenuesWhereWhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<UserRevenuesWhereWhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE conditions for the `where` argument on the query `revenues`. */
export type UserRevenuesWhereWhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars['String'];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: Maybe<UserRevenuesWhereWhereConditions>;
};

export enum UserRole {
  /** Guest */
  Guest = 'Guest',
  /** Candidate */
  Candidate = 'Candidate',
  /** Company */
  Company = 'Company',
  /** Client */
  Client = 'Client',
  /** Employee */
  Employee = 'Employee',
  /** Admin */
  Admin = 'Admin',
  /** Employee manager */
  EmployeeManager = 'EmployeeManager',
  /** Corona helpdesk manager */
  CoronaHelpdeskManager = 'CoronaHelpdeskManager',
  /** User manager */
  UserManager = 'UserManager',
  /** Revenue manager */
  RevenueManager = 'RevenueManager',
  /** Files downloader */
  FilesDownloader = 'FilesDownloader',
  /** Tokenized shared project */
  TokenizedSharedProject = 'TokenizedSharedProject'
}

export type UserStats = {
  __typename?: 'UserStats';
  createdClients: Array<Client>;
  createdCandidates: Array<Candidate>;
  createdCompanies: Array<Company>;
  createdProjects: Array<Project>;
  createdEvents: Array<Event>;
  happenedEvents: Array<Event>;
};

export type UserStatsCount = {
  __typename?: 'UserStatsCount';
  user: User;
  createdClients: Scalars['Int'];
  createdCandidates: Scalars['Int'];
  createdCompanies: Scalars['Int'];
  createdProjects: Scalars['Int'];
  createdEvents: Scalars['Int'];
  happenedEvents: Scalars['Int'];
};

export type Vacation = {
  __typename?: 'Vacation';
  id: Scalars['ObfId'];
  from: Scalars['Date'];
  till: Scalars['Date'];
  days_count: Scalars['Int'];
  status: VacationStatus;
  is_for_last_year: Scalars['Boolean'];
};

export type VacationCapacity = {
  __typename?: 'VacationCapacity';
  year: Scalars['Int'];
  days_count: Scalars['Int'];
};

export enum VacationStatus {
  /** Requested */
  Requested = 'REQUESTED',
  /** Approved */
  Approved = 'APPROVED',
  /** Declined */
  Declined = 'DECLINED'
}

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** The column that is used for the condition. */
  column?: Maybe<Scalars['String']>;
  /** The operator that is used for the condition. */
  operator?: Maybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: Maybe<Scalars['Mixed']>;
  /** A set of conditions that requires all conditions to match. */
  AND?: Maybe<Array<WhereConditions>>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: Maybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: Maybe<WhereConditionsRelation>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The relation that is checked. */
  relation: Scalars['String'];
  /** The comparison operator to test against the amount. */
  operator?: Maybe<SqlOperator>;
  /** The amount to test. */
  amount?: Maybe<Scalars['Int']>;
  /** Additional condition logic. */
  condition?: Maybe<WhereConditions>;
};

export type WorkingHours = {
  __typename?: 'WorkingHours';
  id: Scalars['ObfId'];
  billing_type: BillingType;
  purchasing_per_unit?: Maybe<Scalars['Float']>;
  retail_per_unit?: Maybe<Scalars['Float']>;
  units: Array<WorkingHoursUnit>;
  units_diff?: Maybe<WorkingHoursUnitsDiff>;
  requested_at?: Maybe<Scalars['DateTime']>;
  client_approved_at?: Maybe<Scalars['DateTime']>;
  client_declined_at?: Maybe<Scalars['DateTime']>;
  candidate_approved_at?: Maybe<Scalars['DateTime']>;
  candidate_declined_at?: Maybe<Scalars['DateTime']>;
  updated_at: Scalars['DateTime'];
  created_at: Scalars['DateTime'];
  status: WorkingHoursStatus;
  status_note?: Maybe<Scalars['String']>;
  project: Project;
  candidate: Candidate;
  client?: Maybe<Client>;
};

export enum WorkingHoursStatus {
  /** Draft */
  Draft = 'DRAFT',
  /** Requested by candidate */
  RequestedByCandidate = 'REQUESTED_BY_CANDIDATE',
  /** Declined by client */
  DeclinedByClient = 'DECLINED_BY_CLIENT',
  /** Approved by client */
  ApprovedByClient = 'APPROVED_BY_CLIENT',
  /** Modified by client */
  ModifiedByClient = 'MODIFIED_BY_CLIENT',
  /** Approved by candidate */
  ApprovedByCandidate = 'APPROVED_BY_CANDIDATE',
  /** Declined by candidate */
  DeclinedByCandidate = 'DECLINED_BY_CANDIDATE'
}

export type WorkingHoursUnit = {
  __typename?: 'WorkingHoursUnit';
  date: Scalars['Date'];
  hours?: Maybe<Scalars['Float']>;
  note?: Maybe<Scalars['String']>;
};

export type WorkingHoursUnitInput = {
  date: Scalars['Date'];
  hours?: Maybe<Scalars['Float']>;
  note?: Maybe<Scalars['String']>;
};

export type WorkingHoursUnitsDiff = {
  __typename?: 'WorkingHoursUnitsDiff';
  new: Array<Scalars['Date']>;
  changed: Array<Scalars['Date']>;
  removed: Array<Scalars['Date']>;
};

export enum WorkPlace {
  /** Remote */
  Remote = 'REMOTE',
  /** Onsite */
  Onsite = 'ONSITE',
  /** Remote and onsite */
  RemoteAndOnsite = 'REMOTE_AND_ONSITE'
}

export enum WorkTime {
  /** Fulltime */
  Fulltime = 'FULLTIME',
  /** Parttime */
  Parttime = 'PARTTIME',
  /** Fulltime and parttime */
  FulltimeAndParttime = 'FULLTIME_AND_PARTTIME'
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'TokenInfo' }
    & Pick<TokenInfo, 'userId'>
  ) }
);

export type LoginAsUserMutationVariables = Exact<{
  userId: Scalars['ObfId'];
}>;


export type LoginAsUserMutation = (
  { __typename?: 'Mutation' }
  & { loginAsUser: (
    { __typename?: 'TokenInfo' }
    & Pick<TokenInfo, 'userId'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'roles' | 'firstname' | 'lastname'>
    & { candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
    )>, client?: Maybe<(
      { __typename?: 'Client' }
      & Pick<Client, 'id'>
    )> }
  )> }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'TokenInfo' }
    & Pick<TokenInfo, 'userId'>
  ) }
);

export type CreateDocumentTagMutationVariables = Exact<{
  input: CreateDocumentTagInput;
}>;


export type CreateDocumentTagMutation = (
  { __typename?: 'Mutation' }
  & { createDocumentTag: (
    { __typename?: 'DocumentTag' }
    & Pick<DocumentTag, 'id' | 'title'>
  ) }
);

export type GetCandidatesForAutocompleteQueryVariables = Exact<{
  anyName?: Maybe<Scalars['String']>;
}>;


export type GetCandidatesForAutocompleteQuery = (
  { __typename?: 'Query' }
  & { candidates?: Maybe<(
    { __typename?: 'CandidatePaginator' }
    & { data: Array<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & Pick<ImageSizeFormat, 'regular' | 'retina' | 'thumbnail'>
            )> }
          ) }
        )> }
      ) }
    )> }
  )> }
);

export type GetClientsForAutocompleteQueryVariables = Exact<{
  companyId: Scalars['ObfId'];
}>;


export type GetClientsForAutocompleteQuery = (
  { __typename?: 'Query' }
  & { clientsInCompany: Array<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
    ) }
  )> }
);

export type GetCompaniesForAutocompleteQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
}>;


export type GetCompaniesForAutocompleteQuery = (
  { __typename?: 'Query' }
  & { companies?: Maybe<(
    { __typename?: 'CompanyPaginator' }
    & { data: Array<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form'>
    )> }
  )> }
);

export type GetDocumentTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDocumentTagsQuery = (
  { __typename?: 'Query' }
  & { documentTags: Array<(
    { __typename?: 'DocumentTag' }
    & Pick<DocumentTag, 'id' | 'title'>
  )> }
);

export type GetUsersForAutocompleteQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  where?: Maybe<QueryUsersWhereWhereConditions>;
  roles?: Maybe<Array<UserRole>>;
}>;


export type GetUsersForAutocompleteQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<(
    { __typename?: 'UserPaginator' }
    & { data: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    )> }
  )> }
);

export type CandidateInProjectForClientFragment = (
  { __typename?: 'Candidate' }
  & Pick<Candidate, 'id' | 'email' | 'is_interim' | 'is_permanent' | 'marital_status' | 'desired_job' | 'max_distance_from_home' | 'willing_to_travel' | 'available_from' | 'period_of_notice' | 'next_possible_notice_to' | 'expenses_included' | 'has_hourly_rate'>
  & { nationalities: Array<(
    { __typename?: 'Nationality' }
    & Pick<Nationality, 'id' | 'name'>
  )>, candidate_project_pivot?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'status' | 'is_shortlisted' | 'purchasing_daily_rate' | 'retail_daily_rate' | 'basic_salary' | 'bonus_eur' | 'client_notes' | 'liked_by_client'>
  )>, person: (
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'full_name' | 'gender' | 'birthdate'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), cv_documents: Array<(
    { __typename?: 'Document' }
    & Pick<Document, 'id' | 'title' | 'preview_path' | 'mime_type'>
    & { tags: Array<(
      { __typename?: 'DocumentTag' }
      & Pick<DocumentTag, 'id' | 'title'>
    )> }
  )>, location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id' | 'full_address'>
  )>, industries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title'>
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title'>
  )>, certifications: Array<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title'>
  )>, it_skills: Array<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title'>
  )>, worked_at_companies: Array<(
    { __typename?: 'CandidateCompany' }
    & Pick<CandidateCompany, 'id' | 'from' | 'job_title' | 'job_level' | 'main_responsibilities' | 'till'>
    & { company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'deleted_at'>
      & { logo?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    )> }
  )> }
);

export type CropPropsFragment = (
  { __typename?: 'ImageSizeFormat' }
  & { cropProps?: Maybe<(
    { __typename?: 'CropProps' }
    & Pick<CropProps, 'width' | 'height' | 'top' | 'left'>
  )> }
);

export type DocumentFragment = (
  { __typename?: 'Document' }
  & Pick<Document, 'id' | 'title' | 'mime_type' | 'parsed_content' | 'parsing_status' | 'parsing_failure_reason' | 'created_at' | 'preview_path'>
  & { tags: Array<(
    { __typename?: 'DocumentTag' }
    & Pick<DocumentTag, 'id' | 'title'>
  )> }
);

export type EventEventableFragment = (
  { __typename?: 'Event' }
  & { eventable?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ) }
  ) | (
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ) }
  ) | (
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type EventWithUserFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'group' | 'type' | 'notes' | 'happened_at'>
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type EventWithUserAndProjectFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'group' | 'type' | 'notes' | 'happened_at'>
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname'>
  )>, project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'title' | 'deleted_at'>
  )> }
);

export type EventWithUserAndProjectAndEventableFragment = (
  { __typename?: 'Event' }
  & { eventable?: Maybe<(
    { __typename: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
    ) }
  ) | (
    { __typename: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
    ) }
  ) | (
    { __typename: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName'>
  )> }
  & EventWithUserAndProjectFragment
);

export type GetCandidatesFragment = (
  { __typename?: 'Candidate' }
  & Pick<Candidate, 'id' | 'deleted_at' | 'created_at' | 'email' | 'user_id' | 'is_interim' | 'is_permanent' | 'is_research' | 'basic_salary' | 'daily_rate' | 'period_of_notice' | 'caution' | 'was_placed' | 'is_blacklisted'>
  & { person: (
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'full_name' | 'client_id' | 'birthdate' | 'gender'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), industries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title'>
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title'>
  )>, phonenumbers: Array<(
    { __typename?: 'Phonenumber' }
    & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number'>
  )>, documents: Array<(
    { __typename?: 'Document' }
    & DocumentFragment
  )>, location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id' | 'full_address' | 'postal_code' | 'city' | 'country'>
  )>, worked_at_companies: Array<(
    { __typename?: 'CandidateCompany' }
    & Pick<CandidateCompany, 'id' | 'job_title'>
    & { company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'aliasOrName' | 'legal_form'>
      & { logo?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    )> }
  )> }
);

export type GetClientsFragment = (
  { __typename?: 'Client' }
  & Pick<Client, 'id' | 'deleted_at' | 'created_at' | 'user_id' | 'email' | 'position' | 'is_research'>
  & { person: (
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'full_name' | 'candidate_id'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), company?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName' | 'legal_form'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )>, phonenumbers: Array<(
    { __typename?: 'Phonenumber' }
    & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
  )> }
);

export type GetCompaniesFragment = (
  { __typename?: 'Company' }
  & Pick<Company, 'id' | 'deleted_at' | 'created_at' | 'alias' | 'aliasOrName' | 'name' | 'website' | 'jobs_external_link' | 'legal_form'>
  & { logo?: Maybe<(
    { __typename?: 'Image' }
    & Pick<Image, 'id'>
    & { sizes: (
      { __typename?: 'ImageSizes' }
      & { PROFILE_IMAGE?: Maybe<(
        { __typename?: 'ImageSizeFormat' }
        & ImageSizeFormatFragment
      )> }
    ) }
  )>, industries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title'>
  )>, locations: Array<(
    { __typename?: 'Location' }
    & Pick<Location, 'id' | 'full_address' | 'label'>
  )>, phonenumbers: Array<(
    { __typename?: 'Phonenumber' }
    & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
  )> }
);

export type GetProjectsFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'deleted_at' | 'created_at' | 'title' | 'status' | 'is_interim' | 'is_permanent' | 'archived_at' | 'candidates_count' | 'shortlisted_candidates_count' | 'updated_at'>
  & { company: (
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), clients: Array<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ) }
  )>, users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type ImageSizeFormatFragment = (
  { __typename?: 'ImageSizeFormat' }
  & Pick<ImageSizeFormat, 'regular' | 'retina' | 'thumbnail'>
);

export type ModificationHistoryFragment = (
  { __typename?: 'History' }
  & Pick<History, 'historiable_type' | 'action' | 'changes' | 'changed_model' | 'created_at'>
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'firstname' | 'lastname'>
  )> }
);

export type PaginatorFragment = (
  { __typename?: 'PaginatorInfo' }
  & Pick<PaginatorInfo, 'currentPage' | 'lastPage' | 'perPage' | 'total'>
);

export type PlacedCandidateFragment = (
  { __typename?: 'Candidate' }
  & Pick<Candidate, 'id' | 'deleted_at' | 'is_permanent' | 'is_interim' | 'has_hourly_rate'>
  & { person: (
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'gender' | 'birthdate' | 'full_name'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), candidate_project_pivot?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'status' | 'is_shortlisted' | 'purchasing_daily_rate' | 'retail_daily_rate' | 'basic_salary' | 'bonus_eur' | 'liked_by_client'>
  )>, working_hours: Array<(
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  )> }
);

export type ProjectDataForClientViewsFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'status' | 'status_note' | 'is_interim' | 'is_permanent' | 'title' | 'max_basic_salary' | 'max_bonus_eur' | 'is_business_car_included' | 'fee_structure' | 'expenses_included' | 'max_daily_rate' | 'retain' | 'project_start' | 'project_end' | 'placed_start_at' | 'notes'>
  & { industries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title'>
    & { synonyms: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )> }
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title'>
    & { synonyms: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )> }
  )>, certifications: Array<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title'>
  )>, it_skills: Array<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title'>
    & { synonyms: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )> }
  )>, company: (
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName' | 'deleted_at'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), clients: Array<(
    { __typename?: 'Client' }
    & Pick<Client, 'id' | 'position' | 'deleted_at' | 'user_id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ), client_project_pivot?: Maybe<(
      { __typename?: 'ClientProjectPivot' }
      & Pick<ClientProjectPivot, 'has_long_list_access'>
    )> }
  )>, languages: Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'code' | 'name'>
    & { language_pivot?: Maybe<(
      { __typename?: 'LanguagePivot' }
      & Pick<LanguagePivot, 'level'>
    )> }
  )>, users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname' | 'contact_email' | 'contact_number'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type RevenueFragment = (
  { __typename?: 'Revenue' }
  & Pick<Revenue, 'id' | 'author_id' | 'amount' | 'year' | 'month' | 'type' | 'stage'>
  & { revenue_users: Array<(
    { __typename?: 'RevenueUserPivot' }
    & Pick<RevenueUserPivot, 'id' | 'percent'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ) }
  )> }
);

export type WorkingHoursFragment = (
  { __typename?: 'WorkingHours' }
  & Pick<WorkingHours, 'id' | 'billing_type' | 'purchasing_per_unit' | 'retail_per_unit' | 'status' | 'status_note' | 'client_approved_at' | 'client_declined_at' | 'candidate_approved_at' | 'candidate_declined_at' | 'requested_at' | 'updated_at'>
  & { units: Array<(
    { __typename?: 'WorkingHoursUnit' }
    & Pick<WorkingHoursUnit, 'date' | 'hours' | 'note'>
  )>, units_diff?: Maybe<(
    { __typename?: 'WorkingHoursUnitsDiff' }
    & Pick<WorkingHoursUnitsDiff, 'new' | 'changed' | 'removed'>
  )> }
);

export type AddToBucketMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: AddToBucketInput;
}>;


export type AddToBucketMutation = (
  { __typename?: 'Mutation' }
  & { addToBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type CopyBucketMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type CopyBucketMutation = (
  { __typename?: 'Mutation' }
  & { copyBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type CreateBucketMutationVariables = Exact<{
  input: CreateBucketInput;
}>;


export type CreateBucketMutation = (
  { __typename?: 'Mutation' }
  & { createBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id' | 'title'>
  )> }
);

export type DeleteBucketMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteBucketMutation = (
  { __typename?: 'Mutation' }
  & { deleteBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type ExportBucketQueryVariables = Exact<{
  id: Scalars['ObfId'];
  candidateColumns: Array<Scalars['String']>;
  clientColumns: Array<Scalars['String']>;
  companyColumns: Array<Scalars['String']>;
  projectColumns: Array<Scalars['String']>;
}>;


export type ExportBucketQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'exportBucket'>
);

export type GetBucketForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetBucketForEditQuery = (
  { __typename?: 'Query' }
  & { bucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id' | 'title' | 'notes' | 'owner_id'>
    & { shared_with: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
      & { bucket_user_permission?: Maybe<(
        { __typename?: 'BucketUserPermission' }
        & Pick<BucketUserPermission, 'is_write_allowed'>
      )> }
    )> }
  )> }
);

export type GetBucketForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetBucketForViewQuery = (
  { __typename?: 'Query' }
  & { bucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id' | 'title' | 'notes'>
    & { candidates: Array<(
      { __typename?: 'Candidate' }
      & GetCandidatesFragment
    )>, clients: Array<(
      { __typename?: 'Client' }
      & GetClientsFragment
    )>, companies: Array<(
      { __typename?: 'Company' }
      & GetCompaniesFragment
    )>, projects: Array<(
      { __typename?: 'Project' }
      & GetProjectsFragment
    )>, owner: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    ), shared_with: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
      & { bucket_user_permission?: Maybe<(
        { __typename?: 'BucketUserPermission' }
        & Pick<BucketUserPermission, 'is_write_allowed'>
      )> }
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )> }
  )> }
);

export type GetBucketsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBucketsQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { buckets: Array<(
      { __typename?: 'Bucket' }
      & Pick<Bucket, 'id' | 'title' | 'notes'>
      & { shared_with: Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
        & { bucket_user_permission?: Maybe<(
          { __typename?: 'BucketUserPermission' }
          & Pick<BucketUserPermission, 'is_write_allowed'>
        )> }
      )> }
    )>, shared_buckets: Array<(
      { __typename?: 'Bucket' }
      & Pick<Bucket, 'id' | 'title' | 'notes'>
      & { bucket_user_permission?: Maybe<(
        { __typename?: 'BucketUserPermission' }
        & Pick<BucketUserPermission, 'is_write_allowed'>
      )>, owner: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
      ) }
    )> }
  )> }
);

export type RemoveFromBucketMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: AddToBucketInput;
}>;


export type RemoveFromBucketMutation = (
  { __typename?: 'Mutation' }
  & { removeFromBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type UpdateBucketMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateBucketInput;
}>;


export type UpdateBucketMutation = (
  { __typename?: 'Mutation' }
  & { updateBucket?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type UpdateBucketAdditionalMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateBucketAdditionalInput;
}>;


export type UpdateBucketAdditionalMutation = (
  { __typename?: 'Mutation' }
  & { updateBucketAdditional?: Maybe<(
    { __typename?: 'Bucket' }
    & Pick<Bucket, 'id'>
  )> }
);

export type AddCandidateToProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
}>;


export type AddCandidateToProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addCandidateToProject'>
);

export type AddCandidatesToProjectMutationVariables = Exact<{
  candidateIds: Array<Scalars['ObfId']>;
  projectId: Scalars['ObfId'];
}>;


export type AddCandidatesToProjectMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addCandidatesToProject'>
);

export type ConsentCandidateInProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
}>;


export type ConsentCandidateInProjectMutation = (
  { __typename?: 'Mutation' }
  & { consentCandidateInProject?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'consented_at' | 'contradicted_at'>
  )> }
);

export type ContradictCandidateInProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
}>;


export type ContradictCandidateInProjectMutation = (
  { __typename?: 'Mutation' }
  & { contradictCandidateInProject?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'contradicted_at'>
  )> }
);

export type CreateCandidateMutationVariables = Exact<{
  input: CreateCandidateInput;
}>;


export type CreateCandidateMutation = (
  { __typename?: 'Mutation' }
  & { createCandidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id'>
    ) }
  )> }
);

export type CreateUserForCandidateMutationVariables = Exact<{
  candidate_id: Scalars['ObfId'];
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserForCandidateMutation = (
  { __typename?: 'Mutation' }
  & { createUserForCandidate?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type DeleteCandidateMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteCandidateMutation = (
  { __typename?: 'Mutation' }
  & { deleteCandidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
  )> }
);

export type ForceDeleteCandidateMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ForceDeleteCandidateMutation = (
  { __typename?: 'Mutation' }
  & { forceDeleteCandidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
  )> }
);

export type GenerateCandidateAccountCreationTokenMutationVariables = Exact<{
  candidate_id: Scalars['ObfId'];
}>;


export type GenerateCandidateAccountCreationTokenMutation = (
  { __typename?: 'Mutation' }
  & { generateCandidateAccountCreationToken?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id' | 'create_account_token' | 'user_id'>
  )> }
);

export type GetCandidateQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCandidateQuery = (
  { __typename?: 'Query' }
  & { candidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id' | 'email' | 'marital_status' | 'is_blacklisted' | 'blacklisting_reason' | 'is_interim' | 'is_permanent' | 'skype_name' | 'desired_job' | 'max_distance_from_home' | 'willing_to_travel' | 'available_from' | 'daily_rate' | 'has_hourly_rate' | 'expenses_included' | 'period_of_notice' | 'basic_salary' | 'bonus_eur' | 'is_business_car_included' | 'other_bonus' | 'notes' | 'linked_in_profile' | 'xing_profile' | 'url' | 'is_research' | 'zoom_id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'other_firstnames' | 'lastname' | 'birth_name' | 'gender' | 'birthdate'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'original_image'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
            & CropPropsFragment
          )> }
        ) }
      )> }
    ), nationalities: Array<(
      { __typename?: 'Nationality' }
      & Pick<Nationality, 'id'>
    )>, location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )>, worked_at_companies: Array<(
      { __typename?: 'CandidateCompany' }
      & Pick<CandidateCompany, 'id' | 'from' | 'job_title' | 'job_level' | 'main_responsibilities' | 'till'>
      & { company?: Maybe<(
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'name'>
      )> }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )>, educations: Array<(
      { __typename?: 'Education' }
      & Pick<Education, 'id' | 'main_field_of_study' | 'additional_fields_of_study' | 'from' | 'till' | 'degree' | 'final_grade' | 'notes'>
      & { institution?: Maybe<(
        { __typename?: 'Institution' }
        & Pick<Institution, 'id' | 'name'>
      )> }
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )> }
  )> }
);

export type GetCandidateByAccountCreationTokenQueryVariables = Exact<{
  candidate_id: Scalars['ObfId'];
  token: Scalars['String'];
}>;


export type GetCandidateByAccountCreationTokenQuery = (
  { __typename?: 'Query' }
  & { getCandidateByAccountCreationToken?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
    ) }
  )> }
);

export type GetCandidateContactDataQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCandidateContactDataQuery = (
  { __typename?: 'Query' }
  & { candidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id' | 'email'>
    & { phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )> }
  )> }
);

export type GetCandidateForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCandidateForViewQuery = (
  { __typename?: 'Query' }
  & { candidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id' | 'email' | 'marital_status' | 'is_blacklisted' | 'blacklisting_reason' | 'is_interim' | 'is_permanent' | 'skype_name' | 'desired_job' | 'max_distance_from_home' | 'willing_to_travel' | 'available_from' | 'daily_rate' | 'has_hourly_rate' | 'expenses_included' | 'period_of_notice' | 'next_possible_notice_to' | 'basic_salary' | 'bonus_eur' | 'is_business_car_included' | 'other_bonus' | 'notes' | 'linked_in_profile' | 'xing_profile' | 'url' | 'create_account_token' | 'user_id' | 'is_research' | 'deleted_at' | 'caution' | 'was_placed' | 'zoom_id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'other_firstnames' | 'lastname' | 'full_name' | 'birth_name' | 'gender' | 'birthdate' | 'client_id'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ), nationalities: Array<(
      { __typename?: 'Nationality' }
      & Pick<Nationality, 'id' | 'name'>
    )>, location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )>, projects: Array<(
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'title' | 'status' | 'created_at' | 'deleted_at'>
    )>, worked_at_companies: Array<(
      { __typename?: 'CandidateCompany' }
      & Pick<CandidateCompany, 'id' | 'from' | 'job_title' | 'job_level' | 'main_responsibilities' | 'till'>
      & { company?: Maybe<(
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'name' | 'deleted_at'>
        & { logo?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & Pick<ImageSizeFormat, 'regular' | 'retina' | 'thumbnail'>
            )> }
          ) }
        )> }
      )> }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )>, educations: Array<(
      { __typename?: 'Education' }
      & Pick<Education, 'id' | 'main_field_of_study' | 'additional_fields_of_study' | 'from' | 'till' | 'degree' | 'final_grade' | 'notes'>
      & { institution?: Maybe<(
        { __typename?: 'Institution' }
        & Pick<Institution, 'id' | 'name'>
      )> }
    )>, events: Array<(
      { __typename?: 'Event' }
      & EventWithUserAndProjectFragment
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )> }
  )> }
);

export type GetCandidatesQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  names?: Maybe<FirstAndLastname>;
  filter?: Maybe<CandidatesFilter>;
}>;


export type GetCandidatesQuery = (
  { __typename?: 'Query' }
  & { candidates?: Maybe<(
    { __typename?: 'CandidatePaginator' }
    & { data: Array<(
      { __typename?: 'Candidate' }
      & GetCandidatesFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type GetConsentForCandidateInProjectQueryVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  timestamp: Scalars['String'];
}>;


export type GetConsentForCandidateInProjectQuery = (
  { __typename?: 'Query' }
  & { getConsentForCandidateInProject?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'consented_at' | 'contradicted_at'>
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'full_name'>
      ) }
    ), project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'title'>
      & { company: (
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'name' | 'legal_form'>
        & { logo?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & ImageSizeFormatFragment
            )> }
          ) }
        )> }
      ) }
    ) }
  )> }
);

export type GetSuitableCandidatesForProjectQueryVariables = Exact<{
  projectId: Scalars['ObfId'];
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
}>;


export type GetSuitableCandidatesForProjectQuery = (
  { __typename?: 'Query' }
  & { suitableCandidatesForProject?: Maybe<(
    { __typename?: 'CandidatePaginator' }
    & { paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ), data: Array<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id' | 'is_interim' | 'is_permanent' | 'desired_job' | 'available_from' | 'daily_rate' | 'has_hourly_rate' | 'expenses_included' | 'period_of_notice' | 'next_possible_notice_to' | 'basic_salary' | 'bonus_eur' | 'is_business_car_included' | 'other_bonus' | 'is_research' | 'caution' | 'was_placed' | 'match_score' | 'is_blacklisted' | 'is_in_project'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname' | 'full_name' | 'gender' | 'birthdate'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & ImageSizeFormatFragment
            )> }
          ) }
        )> }
      ), location?: Maybe<(
        { __typename?: 'Location' }
        & Pick<Location, 'id' | 'full_address' | 'postal_code' | 'city' | 'country'>
      )>, industries: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title'>
      )>, skills: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title'>
      )>, certifications: Array<(
        { __typename?: 'Certification' }
        & Pick<Certification, 'id' | 'title'>
      )>, it_skills: Array<(
        { __typename?: 'ItSkill' }
        & Pick<ItSkill, 'id' | 'title'>
      )>, cv_documents: Array<(
        { __typename?: 'Document' }
        & DocumentFragment
      )> }
    )> }
  )> }
);

export type MoveCandidateToShortlistMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  pivot?: Maybe<CandidateProjectPivotInput>;
}>;


export type MoveCandidateToShortlistMutation = (
  { __typename?: 'Mutation' }
  & { moveCandidateToShortlist?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { candidate_project_pivot?: Maybe<(
      { __typename?: 'CandidateProjectPivot' }
      & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status' | 'purchasing_daily_rate' | 'retail_daily_rate' | 'basic_salary' | 'bonus_eur'>
    )> }
  )> }
);

export type OnHoldCandidateInProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type OnHoldCandidateInProjectMutation = (
  { __typename?: 'Mutation' }
  & { onHoldCandidateInProject?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type ReactivateCandidateInProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type ReactivateCandidateInProjectMutation = (
  { __typename?: 'Mutation' }
  & { reactivateCandidateInProject?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type RejectCandidateByBlackbullMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type RejectCandidateByBlackbullMutation = (
  { __typename?: 'Mutation' }
  & { rejectCandidateByBlackbull?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type RejectCandidateByCandidateMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type RejectCandidateByCandidateMutation = (
  { __typename?: 'Mutation' }
  & { rejectCandidateByCandidate?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type RejectCandidateByClientMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type RejectCandidateByClientMutation = (
  { __typename?: 'Mutation' }
  & { rejectCandidateByClient?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type RemoveCandidateFromLonglistMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
}>;


export type RemoveCandidateFromLonglistMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeCandidateFromLonglist'>
);

export type RemoveCandidateFromShortlistMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
}>;


export type RemoveCandidateFromShortlistMutation = (
  { __typename?: 'Mutation' }
  & { removeCandidateFromShortlist?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { candidate_project_pivot?: Maybe<(
      { __typename?: 'CandidateProjectPivot' }
      & Pick<CandidateProjectPivot, 'is_shortlisted' | 'status'>
    )> }
  )> }
);

export type RestoreCandidateMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type RestoreCandidateMutation = (
  { __typename?: 'Mutation' }
  & { restoreCandidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
  )> }
);

export type SendConsentToCandidateInProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
}>;


export type SendConsentToCandidateInProjectMutation = (
  { __typename?: 'Mutation' }
  & { sendConsentToCandidateInProject?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'consent_sent_at' | 'consent_sent_to_email'>
  )> }
);

export type ThumbDownCandidateByClientMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type ThumbDownCandidateByClientMutation = (
  { __typename?: 'Mutation' }
  & { thumbDownCandidateByClient?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'liked_by_client'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type ThumbUpCandidateByClientMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type ThumbUpCandidateByClientMutation = (
  { __typename?: 'Mutation' }
  & { thumbUpCandidateByClient?: Maybe<(
    { __typename?: 'CandidateAndEvent' }
    & { candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'liked_by_client'>
      )> }
    ), event: (
      { __typename?: 'Event' }
      & EventWithUserFragment
    ) }
  )> }
);

export type UpdateCandidateMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateCandidateInput;
}>;


export type UpdateCandidateMutation = (
  { __typename?: 'Mutation' }
  & { updateCandidate?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id'>
    ) }
  )> }
);

export type UpdateCandidateAdditionalMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateCandidateAdditionalInput;
}>;


export type UpdateCandidateAdditionalMutation = (
  { __typename?: 'Mutation' }
  & { updateCandidateAdditional?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
  )> }
);

export type UpdateCandidateDocumentsMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
}>;


export type UpdateCandidateDocumentsMutation = (
  { __typename?: 'Mutation' }
  & { updateCandidateDocuments?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
  )> }
);

export type UpdateCandidateNotesWithinProjectMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type UpdateCandidateNotesWithinProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateCandidateNotesWithinProject?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { candidate_project_pivot?: Maybe<(
      { __typename?: 'CandidateProjectPivot' }
      & Pick<CandidateProjectPivot, 'client_notes'>
    )> }
  )> }
);

export type UpdateCandidateProjectPivotMutationVariables = Exact<{
  candidateId: Scalars['ObfId'];
  projectId: Scalars['ObfId'];
  pivot?: Maybe<CandidateProjectPivotInput>;
}>;


export type UpdateCandidateProjectPivotMutation = (
  { __typename?: 'Mutation' }
  & { updateCandidateProjectPivot?: Maybe<(
    { __typename?: 'Candidate' }
    & Pick<Candidate, 'id'>
    & { candidate_project_pivot?: Maybe<(
      { __typename?: 'CandidateProjectPivot' }
      & Pick<CandidateProjectPivot, 'purchasing_daily_rate' | 'retail_daily_rate' | 'basic_salary' | 'bonus_eur'>
    )> }
  )> }
);

export type CreateCertificationMutationVariables = Exact<{
  input: CreateCertificationInput;
}>;


export type CreateCertificationMutation = (
  { __typename?: 'Mutation' }
  & { createCertification: (
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type DeleteCertificationMutationVariables = Exact<{
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
}>;


export type DeleteCertificationMutation = (
  { __typename?: 'Mutation' }
  & { deleteCertification?: Maybe<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id'>
  )> }
);

export type GetAllCertificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCertificationsQuery = (
  { __typename?: 'Query' }
  & { allCertifications: Array<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
  )> }
);

export type GetCertificationForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCertificationForEditQuery = (
  { __typename?: 'Query' }
  & { certification?: Maybe<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title' | 'is_reviewed' | 'parent_id'>
    & { synonym_representative?: Maybe<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, parent?: Maybe<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, children: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )> }
  )> }
);

export type GetCertificationForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCertificationForViewQuery = (
  { __typename?: 'Query' }
  & { certification?: Maybe<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title' | 'is_reviewed' | 'synonym_representative_id'>
    & { synonyms: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title' | 'synonym_representative_id' | 'is_reviewed'>
    )>, parent?: Maybe<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
    )>, children: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
      & { synonyms: Array<(
        { __typename?: 'Certification' }
        & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
      )> }
    )> }
  )> }
);

export type GetCertificationsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
}>;


export type GetCertificationsQuery = (
  { __typename?: 'Query' }
  & { certifications?: Maybe<(
    { __typename?: 'CertificationPaginator' }
    & { data: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpdateCertificationMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateCertificationInput;
}>;


export type UpdateCertificationMutation = (
  { __typename?: 'Mutation' }
  & { updateCertification: (
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type CreateChArticleMutationVariables = Exact<{
  input: CreateChArticleInput;
}>;


export type CreateChArticleMutation = (
  { __typename?: 'Mutation' }
  & { createChArticle?: Maybe<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id'>
  )> }
);

export type DeleteChArticleMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteChArticleMutation = (
  { __typename?: 'Mutation' }
  & { deleteChArticle?: Maybe<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id'>
  )> }
);

export type GetChArticleForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChArticleForEditQuery = (
  { __typename?: 'Query' }
  & { chArticle?: Maybe<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id' | 'title' | 'content' | 'category' | 'author' | 'author_position' | 'author_company' | 'image_copyright'>
    & { image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_ARTICLE_FULL?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )>, author_image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_ARTICLE_AUTHOR?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetChArticleForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChArticleForViewQuery = (
  { __typename?: 'Query' }
  & { chArticle?: Maybe<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id' | 'title' | 'content' | 'category' | 'author' | 'author_position' | 'author_company' | 'image_copyright'>
    & { image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_ARTICLE_FULL?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )>, author_image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_ARTICLE_AUTHOR?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetChArticlesQueryVariables = Exact<{
  orderBy?: Maybe<Array<QueryChArticlesOrderByOrderByClause>>;
}>;


export type GetChArticlesQuery = (
  { __typename?: 'Query' }
  & { chArticles: Array<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id' | 'title' | 'category' | 'author'>
  )> }
);

export type UpdateChArticleMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateChArticleInput;
}>;


export type UpdateChArticleMutation = (
  { __typename?: 'Mutation' }
  & { updateChArticle?: Maybe<(
    { __typename?: 'ChArticle' }
    & Pick<ChArticle, 'id'>
  )> }
);

export type UploadChArticleImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadChArticleImageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'uploadChArticleImage'>
);

export type CreateChCategoryMutationVariables = Exact<{
  input: CreateChCategoryInput;
}>;


export type CreateChCategoryMutation = (
  { __typename?: 'Mutation' }
  & { createChCategory?: Maybe<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id'>
  )> }
);

export type DeleteChCategoryMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteChCategoryMutation = (
  { __typename?: 'Mutation' }
  & { deleteChCategory?: Maybe<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id'>
  )> }
);

export type GetChCategoriesQueryVariables = Exact<{
  orderBy?: Maybe<Array<QueryChCategoriesOrderByOrderByClause>>;
}>;


export type GetChCategoriesQuery = (
  { __typename?: 'Query' }
  & { chCategories: Array<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id' | 'title' | 'short_text'>
  )> }
);

export type GetChCategoryForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChCategoryForEditQuery = (
  { __typename?: 'Query' }
  & { chCategory?: Maybe<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id' | 'title' | 'short_text' | 'long_text'>
    & { candidates: Array<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & Pick<ImageSizeFormat, 'regular' | 'retina' | 'thumbnail'>
            )> }
          ) }
        )> }
      ), candidate_ch_category_pivot?: Maybe<(
        { __typename?: 'CandidateChCategoryPivot' }
        & Pick<CandidateChCategoryPivot, 'text' | 'phonenumber' | 'email' | 'work_place' | 'work_time'>
      )> }
    )> }
  )> }
);

export type GetChCategoryForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChCategoryForViewQuery = (
  { __typename?: 'Query' }
  & { chCategory?: Maybe<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id' | 'title' | 'short_text' | 'long_text'>
    & { candidates: Array<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & Pick<ImageSizeFormat, 'regular' | 'retina' | 'thumbnail'>
            )> }
          ) }
        )> }
      ), candidate_ch_category_pivot?: Maybe<(
        { __typename?: 'CandidateChCategoryPivot' }
        & Pick<CandidateChCategoryPivot, 'text' | 'phonenumber' | 'email' | 'work_place' | 'work_time'>
      )>, industries: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title'>
      )>, skills: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title'>
      )> }
    )> }
  )> }
);

export type UpdateChCategoryMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateChCategoryInput;
}>;


export type UpdateChCategoryMutation = (
  { __typename?: 'Mutation' }
  & { updateChCategory?: Maybe<(
    { __typename?: 'ChCategory' }
    & Pick<ChCategory, 'id'>
  )> }
);

export type CreateChPodcastMutationVariables = Exact<{
  input: CreateChPodcastInput;
}>;


export type CreateChPodcastMutation = (
  { __typename?: 'Mutation' }
  & { createChPodcast?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id'>
  )> }
);

export type DeleteChPodcastMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteChPodcastMutation = (
  { __typename?: 'Mutation' }
  & { deleteChPodcast?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id'>
  )> }
);

export type GetChPodcastForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChPodcastForEditQuery = (
  { __typename?: 'Query' }
  & { chPodcast?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id' | 'title' | 'description' | 'rss_title' | 'rss_description' | 'public_url' | 'category'>
    & { image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_PODCAST_FULL?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetChPodcastForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetChPodcastForViewQuery = (
  { __typename?: 'Query' }
  & { chPodcast?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id' | 'title' | 'description' | 'rss_title' | 'rss_description' | 'duration' | 'public_url' | 'category'>
    & { image?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { CH_PODCAST_FULL?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetChPodcastsQueryVariables = Exact<{
  orderBy?: Maybe<Array<QueryChPodcastsOrderByOrderByClause>>;
}>;


export type GetChPodcastsQuery = (
  { __typename?: 'Query' }
  & { chPodcasts: Array<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id' | 'title' | 'description' | 'duration'>
  )> }
);

export type UpdateChPodcastMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateChPodcastInput;
}>;


export type UpdateChPodcastMutation = (
  { __typename?: 'Mutation' }
  & { updateChPodcast?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id'>
  )> }
);

export type UpdateChPodcastAdditionalMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateChPodcastAdditionalInput;
}>;


export type UpdateChPodcastAdditionalMutation = (
  { __typename?: 'Mutation' }
  & { updateChPodcastAdditional?: Maybe<(
    { __typename?: 'ChPodcast' }
    & Pick<ChPodcast, 'id'>
  )> }
);

export type CreateClientMutationVariables = Exact<{
  input: CreateClientInput;
}>;


export type CreateClientMutation = (
  { __typename?: 'Mutation' }
  & { createClient?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'firstname' | 'lastname'>
    ) }
  )> }
);

export type CreateUserForClientMutationVariables = Exact<{
  client_id: Scalars['ObfId'];
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserForClientMutation = (
  { __typename?: 'Mutation' }
  & { createUserForClient?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type DeleteClientMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteClientMutation = (
  { __typename?: 'Mutation' }
  & { deleteClient?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
  )> }
);

export type ForceDeleteClientMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ForceDeleteClientMutation = (
  { __typename?: 'Mutation' }
  & { forceDeleteClient?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
  )> }
);

export type GenerateClientAccountCreationTokenMutationVariables = Exact<{
  client_id: Scalars['ObfId'];
}>;


export type GenerateClientAccountCreationTokenMutation = (
  { __typename?: 'Mutation' }
  & { generateClientAccountCreationToken?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id' | 'create_account_token' | 'user_id'>
  )> }
);

export type GetClientQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetClientQuery = (
  { __typename?: 'Query' }
  & { client?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id' | 'email' | 'position' | 'notes' | 'is_research' | 'zoom_id' | 'deleted_at'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'other_firstnames' | 'lastname' | 'birth_name' | 'gender' | 'birthdate'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id' | 'original_image'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
            & CropPropsFragment
          )> }
        ) }
      )> }
    ), location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address' | 'label'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name'>
    )> }
  )> }
);

export type GetClientByAccountCreationTokenQueryVariables = Exact<{
  client_id: Scalars['ObfId'];
  token: Scalars['String'];
}>;


export type GetClientByAccountCreationTokenQuery = (
  { __typename?: 'Query' }
  & { getClientByAccountCreationToken?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
    ) }
  )> }
);

export type GetClientForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetClientForViewQuery = (
  { __typename?: 'Query' }
  & { client?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id' | 'email' | 'deleted_at' | 'position' | 'need_review_after_autocomplete' | 'notes' | 'is_research' | 'user_id' | 'zoom_id' | 'create_account_token'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'title' | 'firstname' | 'other_firstnames' | 'lastname' | 'birth_name' | 'full_name' | 'gender' | 'birthdate' | 'candidate_id'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ), location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form' | 'deleted_at'>
    )>, projects?: Maybe<(
      { __typename?: 'ProjectPaginator' }
      & { data: Array<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'title' | 'status' | 'created_at' | 'deleted_at'>
      )> }
    )>, events: Array<(
      { __typename?: 'Event' }
      & EventWithUserAndProjectFragment
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )> }
  )> }
);

export type GetClientsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  names?: Maybe<FirstAndLastname>;
  filter?: Maybe<ClientsFilter>;
}>;


export type GetClientsQuery = (
  { __typename?: 'Query' }
  & { clients?: Maybe<(
    { __typename?: 'ClientPaginator' }
    & { data: Array<(
      { __typename?: 'Client' }
      & GetClientsFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type RestoreClientMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type RestoreClientMutation = (
  { __typename?: 'Mutation' }
  & { restoreClient?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
  )> }
);

export type UpdateClientMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateClientInput;
}>;


export type UpdateClientMutation = (
  { __typename?: 'Mutation' }
  & { updateClient?: Maybe<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id'>
    ) }
  )> }
);

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = (
  { __typename?: 'Mutation' }
  & { createCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'name'>
  )> }
);

export type DeleteCompanyMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteCompanyMutation = (
  { __typename?: 'Mutation' }
  & { deleteCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type ForceDeleteCompanyMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ForceDeleteCompanyMutation = (
  { __typename?: 'Mutation' }
  & { forceDeleteCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type GetCompaniesQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  filter?: Maybe<CompaniesFilter>;
}>;


export type GetCompaniesQuery = (
  { __typename?: 'Query' }
  & { companies?: Maybe<(
    { __typename?: 'CompanyPaginator' }
    & { data: Array<(
      { __typename?: 'Company' }
      & GetCompaniesFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type GetCompanyQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCompanyQuery = (
  { __typename?: 'Query' }
  & { company?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'alias' | 'name' | 'legal_form' | 'website' | 'email' | 'employees_count' | 'annual_sales' | 'about' | 'jobs_external_link' | 'invoice_notes'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )>, industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, locations: Array<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address' | 'label'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, parent_company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name'>
    )>, child_companies: Array<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name'>
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )> }
  )> }
);

export type GetCompanyForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCompanyForViewQuery = (
  { __typename?: 'Query' }
  & { company?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'alias' | 'name' | 'legal_form' | 'aliasOrName' | 'website' | 'email' | 'employees_count' | 'annual_sales' | 'about' | 'candidatesCount' | 'need_review_after_autocomplete' | 'jobs_external_link' | 'invoice_notes' | 'deleted_at'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )>, industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, locations: Array<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address' | 'label'>
    )>, phonenumbers: Array<(
      { __typename?: 'Phonenumber' }
      & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
    )>, clients: Array<(
      { __typename?: 'Client' }
      & Pick<Client, 'id' | 'position' | 'deleted_at'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & ImageSizeFormatFragment
            )> }
          ) }
        )> }
      ) }
    )>, parent_company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form'>
    )>, child_companies: Array<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form'>
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )>, eventsInclClients: Array<(
      { __typename?: 'Event' }
      & { project?: Maybe<(
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'title' | 'deleted_at'>
      )> }
      & EventWithUserFragment
      & EventEventableFragment
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )> }
  )> }
);

export type GetCompanyLocationsQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCompanyLocationsQuery = (
  { __typename?: 'Query' }
  & { company?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
    & { locations: Array<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address' | 'label'>
    )> }
  )> }
);

export type RestoreCompanyMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type RestoreCompanyMutation = (
  { __typename?: 'Mutation' }
  & { restoreCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type TransferCandidatesAndClientsMutationVariables = Exact<{
  fromCompanyId: Scalars['ObfId'];
  toCompanyId: Scalars['ObfId'];
}>;


export type TransferCandidatesAndClientsMutation = (
  { __typename?: 'Mutation' }
  & { transferCandidatesAndClients?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'name'>
  )> }
);

export type UpdateCompanyMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = (
  { __typename?: 'Mutation' }
  & { updateCompany?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type UpdateCompanyAdditionalMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateCompanyAdditionalInput;
}>;


export type UpdateCompanyAdditionalMutation = (
  { __typename?: 'Mutation' }
  & { updateCompanyAdditional?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type UpdateCompanyDocumentsMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
}>;


export type UpdateCompanyDocumentsMutation = (
  { __typename?: 'Mutation' }
  & { updateCompanyDocuments?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id'>
  )> }
);

export type GetDocumentDownloadLinkQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetDocumentDownloadLinkQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getDocumentDownloadLink'>
);

export type GetDocumentPreviewLinkQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetDocumentPreviewLinkQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getDocumentPreviewLink'>
);

export type GetDocumentPreviewLinkByTokenQueryVariables = Exact<{
  id: Scalars['ObfId'];
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type GetDocumentPreviewLinkByTokenQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getDocumentPreviewLinkByToken'>
);

export type CreateEmployeeMutationVariables = Exact<{
  input: CreateEmployeeInput;
}>;


export type CreateEmployeeMutation = (
  { __typename?: 'Mutation' }
  & { createEmployee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type DeleteEmployeeMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteEmployeeMutation = (
  { __typename?: 'Mutation' }
  & { deleteEmployee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type ForceDeleteEmployeeMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ForceDeleteEmployeeMutation = (
  { __typename?: 'Mutation' }
  & { forceDeleteEmployee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type GetEmployeeQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetEmployeeQuery = (
  { __typename?: 'Query' }
  & { employee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id' | 'personalnummer' | 'betr_personalnummer' | 'familienname' | 'geburtsname' | 'vorname' | 'geburtsdatum' | 'geschlecht' | 'versicherungsnummer' | 'geburtsort' | 'familienstand' | 'schwerbehindert' | 'iban' | 'bic' | 'eintrittsdatum' | 'ersteintrittsdatum' | 'betriebsstaette' | 'berufsbezeichnung' | 'ausgeuebte_taetigkeit' | 'beschaeftigungsart' | 'probezeit' | 'probezeit_dauer' | 'weitere_beschaeftigungen' | 'ist_weitere_beschaeftigung_geringfuegig' | 'hoechster_schullabschluss' | 'hoechste_berufsausbildung' | 'beginn_der_ausbildung' | 'voraussichtliches_ende_der_ausbildung' | 'im_baugewerbe_seit' | 'woechentliche_arbeitszeit' | 'verteilung_der_woechentlichen_arbeitszeit' | 'urlaubsanspruch' | 'ist_befristet' | 'ist_zweckbefristet' | 'befristung_arbeitsvertrag_zum' | 'schrieftlicher_abschluss_des_befristeten_arbeitsvertrages' | 'abschluss_arbeitsvertrag_am' | 'befristet_mit_aussicht' | 'ich_wiederspreche_bea_an_bafa' | 'identifikationsnummer' | 'finanzamt_nummer' | 'steuerklasse_faktor' | 'kinderfreibetraege' | 'konfession' | 'gesetzliche_krankenkasse' | 'elterneigenschaft' | 'entl_bezeichnung' | 'entl_betrag' | 'entl_gueltig_ab' | 'stundenlohn' | 'stundenlohn_gueltig_ab' | 'vwl_empfaenger' | 'vwl_betrag' | 'vwl_ag_anteil' | 'vwl_seit_wann' | 'vwl_vertragsnummer' | 'vwl_iban' | 'vwl_bic' | 'steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr' | 'deleted_at'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    )>, staatsangehoerigkeit: Array<(
      { __typename?: 'Nationality' }
      & Pick<Nationality, 'id' | 'name'>
    )>, location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address'>
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )> }
  )> }
);

export type GetEmployeeForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetEmployeeForViewQuery = (
  { __typename?: 'Query' }
  & { employee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id' | 'personalnummer' | 'betr_personalnummer' | 'familienname' | 'geburtsname' | 'vorname' | 'geburtsdatum' | 'geschlecht' | 'versicherungsnummer' | 'geburtsort' | 'familienstand' | 'schwerbehindert' | 'iban' | 'bic' | 'eintrittsdatum' | 'ersteintrittsdatum' | 'betriebsstaette' | 'berufsbezeichnung' | 'ausgeuebte_taetigkeit' | 'beschaeftigungsart' | 'probezeit' | 'probezeit_dauer' | 'weitere_beschaeftigungen' | 'ist_weitere_beschaeftigung_geringfuegig' | 'hoechster_schullabschluss' | 'hoechste_berufsausbildung' | 'beginn_der_ausbildung' | 'voraussichtliches_ende_der_ausbildung' | 'im_baugewerbe_seit' | 'woechentliche_arbeitszeit' | 'verteilung_der_woechentlichen_arbeitszeit' | 'urlaubsanspruch' | 'ist_befristet' | 'ist_zweckbefristet' | 'befristung_arbeitsvertrag_zum' | 'schrieftlicher_abschluss_des_befristeten_arbeitsvertrages' | 'abschluss_arbeitsvertrag_am' | 'befristet_mit_aussicht' | 'ich_wiederspreche_bea_an_bafa' | 'identifikationsnummer' | 'finanzamt_nummer' | 'steuerklasse_faktor' | 'kinderfreibetraege' | 'konfession' | 'gesetzliche_krankenkasse' | 'elterneigenschaft' | 'entl_bezeichnung' | 'entl_betrag' | 'entl_gueltig_ab' | 'stundenlohn' | 'stundenlohn_gueltig_ab' | 'vwl_empfaenger' | 'vwl_betrag' | 'vwl_ag_anteil' | 'vwl_seit_wann' | 'vwl_vertragsnummer' | 'vwl_iban' | 'vwl_bic' | 'steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr' | 'deleted_at'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    )>, staatsangehoerigkeit: Array<(
      { __typename?: 'Nationality' }
      & Pick<Nationality, 'id' | 'name'>
    )>, location?: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'full_address'>
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )> }
  )> }
);

export type GetEmployeesQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  where?: Maybe<QueryEmployeesWhereWhereConditions>;
}>;


export type GetEmployeesQuery = (
  { __typename?: 'Query' }
  & { employees?: Maybe<(
    { __typename?: 'EmployeePaginator' }
    & { data: Array<(
      { __typename?: 'Employee' }
      & Pick<Employee, 'id' | 'vorname' | 'familienname' | 'berufsbezeichnung' | 'personalnummer'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type RestoreEmployeeMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type RestoreEmployeeMutation = (
  { __typename?: 'Mutation' }
  & { restoreEmployee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type UpdateEmployeeMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateEmployeeInput;
}>;


export type UpdateEmployeeMutation = (
  { __typename?: 'Mutation' }
  & { updateEmployee?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type UpdateEmployeeDocumentsMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateDocumentsRelationInput;
}>;


export type UpdateEmployeeDocumentsMutation = (
  { __typename?: 'Mutation' }
  & { updateEmployeeDocuments?: Maybe<(
    { __typename?: 'Employee' }
    & Pick<Employee, 'id'>
  )> }
);

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = (
  { __typename?: 'Mutation' }
  & { createEvent: (
    { __typename?: 'Event' }
    & EventWithUserFragment
    & EventEventableFragment
  ) }
);

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteEventMutation = (
  { __typename?: 'Mutation' }
  & { deleteEvent?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
  )> }
);

export type GetEventQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetEventQuery = (
  { __typename?: 'Query' }
  & { event?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & EventWithUserAndProjectAndEventableFragment
  )> }
);

export type GetEventForOverviewModalQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetEventForOverviewModalQuery = (
  { __typename?: 'Query' }
  & { event?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & { project?: Maybe<(
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'title'>
      & { company: (
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'aliasOrName'>
      ) }
    )> }
    & EventEventableFragment
    & EventWithUserFragment
  )> }
);

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'group' | 'type' | 'notes' | 'happened_at'>
  )> }
);

export type CreateIndustryMutationVariables = Exact<{
  input: CreateIndustryInput;
}>;


export type CreateIndustryMutation = (
  { __typename?: 'Mutation' }
  & { createIndustry: (
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type DeleteIndustryMutationVariables = Exact<{
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
}>;


export type DeleteIndustryMutation = (
  { __typename?: 'Mutation' }
  & { deleteIndustry?: Maybe<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id'>
  )> }
);

export type GetAllIndustriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllIndustriesQuery = (
  { __typename?: 'Query' }
  & { allIndustries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
  )> }
);

export type GetIndustriesQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
}>;


export type GetIndustriesQuery = (
  { __typename?: 'Query' }
  & { industries?: Maybe<(
    { __typename?: 'IndustryPaginator' }
    & { data: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type GetIndustryForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetIndustryForEditQuery = (
  { __typename?: 'Query' }
  & { industry?: Maybe<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title' | 'is_reviewed' | 'parent_id'>
    & { synonym_representative?: Maybe<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, parent?: Maybe<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, children: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )> }
  )> }
);

export type GetIndustryForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetIndustryForViewQuery = (
  { __typename?: 'Query' }
  & { industry?: Maybe<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title' | 'is_reviewed' | 'synonym_representative_id'>
    & { synonyms: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title' | 'synonym_representative_id' | 'is_reviewed'>
    )>, parent?: Maybe<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
    )>, children: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
      & { synonyms: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
      )> }
    )> }
  )> }
);

export type UpdateIndustryMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateIndustryInput;
}>;


export type UpdateIndustryMutation = (
  { __typename?: 'Mutation' }
  & { updateIndustry: (
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type CreateInstitutionMutationVariables = Exact<{
  input: CreateInstitutionInput;
}>;


export type CreateInstitutionMutation = (
  { __typename?: 'Mutation' }
  & { createInstitution: (
    { __typename?: 'Institution' }
    & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
  ) }
);

export type DeleteInstitutionMutationVariables = Exact<{
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
}>;


export type DeleteInstitutionMutation = (
  { __typename?: 'Mutation' }
  & { deleteInstitution?: Maybe<(
    { __typename?: 'Institution' }
    & Pick<Institution, 'id'>
  )> }
);

export type GetAllInstitutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstitutionsQuery = (
  { __typename?: 'Query' }
  & { allInstitutions: Array<(
    { __typename?: 'Institution' }
    & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
  )> }
);

export type GetInstitutionForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetInstitutionForEditQuery = (
  { __typename?: 'Query' }
  & { institution?: Maybe<(
    { __typename?: 'Institution' }
    & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
  )> }
);

export type GetInstitutionForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetInstitutionForViewQuery = (
  { __typename?: 'Query' }
  & { institution?: Maybe<(
    { __typename?: 'Institution' }
    & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
  )> }
);

export type GetInstitutionsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
}>;


export type GetInstitutionsQuery = (
  { __typename?: 'Query' }
  & { institutions?: Maybe<(
    { __typename?: 'InstitutionPaginator' }
    & { data: Array<(
      { __typename?: 'Institution' }
      & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpdateInstitutionMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateInstitutionInput;
}>;


export type UpdateInstitutionMutation = (
  { __typename?: 'Mutation' }
  & { updateInstitution: (
    { __typename?: 'Institution' }
    & Pick<Institution, 'id' | 'name' | 'is_reviewed'>
  ) }
);

export type CreateItSkillMutationVariables = Exact<{
  input: CreateItSkillInput;
}>;


export type CreateItSkillMutation = (
  { __typename?: 'Mutation' }
  & { createItSkill: (
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type DeleteItSkillMutationVariables = Exact<{
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
}>;


export type DeleteItSkillMutation = (
  { __typename?: 'Mutation' }
  & { deleteItSkill?: Maybe<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id'>
  )> }
);

export type GetAllItSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllItSkillsQuery = (
  { __typename?: 'Query' }
  & { allItSkills: Array<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
  )> }
);

export type GetItSkillForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetItSkillForEditQuery = (
  { __typename?: 'Query' }
  & { itSkill?: Maybe<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title' | 'is_reviewed' | 'parent_id'>
    & { synonym_representative?: Maybe<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )>, parent?: Maybe<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )>, children: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )> }
  )> }
);

export type GetItSkillForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetItSkillForViewQuery = (
  { __typename?: 'Query' }
  & { itSkill?: Maybe<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title' | 'is_reviewed' | 'synonym_representative_id'>
    & { synonyms: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title' | 'synonym_representative_id' | 'is_reviewed'>
    )>, parent?: Maybe<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
    )>, children: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
      & { synonyms: Array<(
        { __typename?: 'ItSkill' }
        & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
      )> }
    )> }
  )> }
);

export type GetItSkillsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
}>;


export type GetItSkillsQuery = (
  { __typename?: 'Query' }
  & { itSkills?: Maybe<(
    { __typename?: 'ItSkillPaginator' }
    & { data: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpdateItSkillMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateItSkillInput;
}>;


export type UpdateItSkillMutation = (
  { __typename?: 'Mutation' }
  & { updateItSkill: (
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type AddNewstickerIgnoredSourceMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddNewstickerIgnoredSourceMutation = (
  { __typename?: 'Mutation' }
  & { addNewstickerIgnoredSource?: Maybe<(
    { __typename?: 'NewstickerIgnoredSource' }
    & Pick<NewstickerIgnoredSource, 'id'>
  )> }
);

export type GetNewstickerIgnoredSourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNewstickerIgnoredSourcesQuery = (
  { __typename?: 'Query' }
  & { newstickerIgnoredSources?: Maybe<(
    { __typename?: 'NewstickerIgnoredSource' }
    & Pick<NewstickerIgnoredSource, 'id' | 'name'>
  )> }
);

export type DeleteNewstickerItemMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteNewstickerItemMutation = (
  { __typename?: 'Mutation' }
  & { deleteNewstickerItem?: Maybe<(
    { __typename?: 'NewstickerItem' }
    & Pick<NewstickerItem, 'id'>
  )> }
);

export type GetNewstickerItemForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetNewstickerItemForEditQuery = (
  { __typename?: 'Query' }
  & { newstickerItem?: Maybe<(
    { __typename?: 'NewstickerItem' }
    & Pick<NewstickerItem, 'id' | 'title' | 'source' | 'published_at' | 'status' | 'url'>
  )> }
);

export type GetNewstickerItemsQueryVariables = Exact<{
  orderBy?: Maybe<Array<QueryNewstickerItemsOrderByOrderByClause>>;
  status?: Maybe<Array<NewstickerItemStatus>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
}>;


export type GetNewstickerItemsQuery = (
  { __typename?: 'Query' }
  & { newstickerItems?: Maybe<(
    { __typename?: 'NewstickerItemPaginator' }
    & { data: Array<(
      { __typename?: 'NewstickerItem' }
      & Pick<NewstickerItem, 'id' | 'title' | 'source' | 'published_at' | 'status' | 'url'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpsertNewstickerItemMutationVariables = Exact<{
  input: UpsertNewstickerItemInput;
}>;


export type UpsertNewstickerItemMutation = (
  { __typename?: 'Mutation' }
  & { upsertNewstickerItem?: Maybe<(
    { __typename?: 'NewstickerItem' }
    & Pick<NewstickerItem, 'id' | 'status'>
  )> }
);

export type GetPeopleByNameQueryVariables = Exact<{
  names?: Maybe<FirstAndLastname>;
}>;


export type GetPeopleByNameQuery = (
  { __typename?: 'Query' }
  & { people: Array<(
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname' | 'birthdate' | 'birth_name' | 'gender' | 'other_firstnames' | 'candidate_id' | 'client_id'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )> }
  )> }
);

export type ArchiveProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ArchiveProjectMutation = (
  { __typename?: 'Mutation' }
  & { archiveProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'archived_at'>
  )> }
);

export type CancelProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
  cancelled_by: ProjectCanceller;
}>;


export type CancelProjectMutation = (
  { __typename?: 'Mutation' }
  & { cancelProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note'>
  )> }
);

export type ChangeClientLongListAccessMutationVariables = Exact<{
  projectId: Scalars['ObfId'];
  clientId: Scalars['ObfId'];
  newValue: Scalars['Boolean'];
}>;


export type ChangeClientLongListAccessMutation = (
  { __typename?: 'Mutation' }
  & { updateProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { clients: Array<(
      { __typename?: 'Client' }
      & Pick<Client, 'id'>
      & { client_project_pivot?: Maybe<(
        { __typename?: 'ClientProjectPivot' }
        & Pick<ClientProjectPivot, 'has_long_list_access'>
      )> }
    )> }
  )> }
);

export type CompleteProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type CompleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { completeProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note'>
  )> }
);

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
  )> }
);

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
  )> }
);

export type ForceDeleteProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type ForceDeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { forceDeleteProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
  )> }
);

export type GenerateProjectShareLinkMutationVariables = Exact<{
  project_id: Scalars['ObfId'];
  expires_after_days: Scalars['Int'];
  is_longlist_shared?: Maybe<Scalars['Boolean']>;
}>;


export type GenerateProjectShareLinkMutation = (
  { __typename?: 'Mutation' }
  & { generateProjectShareLink: (
    { __typename?: 'ProjectSharedLink' }
    & Pick<ProjectSharedLink, 'token' | 'password' | 'expires_at' | 'guest_accesses' | 'is_longlist_shared'>
  ) }
);

export type GetCandidatesOfProjectQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetCandidatesOfProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
    & { candidates: Array<(
      { __typename?: 'Candidate' }
      & CandidateInProjectlistFragment
    )> }
  )> }
);

export type CandidateInProjectlistFragment = (
  { __typename?: 'Candidate' }
  & Pick<Candidate, 'id' | 'email' | 'is_interim' | 'is_permanent' | 'desired_job' | 'available_from' | 'daily_rate' | 'has_hourly_rate' | 'expenses_included' | 'period_of_notice' | 'next_possible_notice_to' | 'basic_salary' | 'bonus_eur' | 'is_business_car_included' | 'other_bonus' | 'is_research' | 'caution' | 'was_placed' | 'deleted_at'>
  & { person: (
    { __typename?: 'Person' }
    & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname' | 'full_name' | 'gender' | 'birthdate'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), phonenumbers: Array<(
    { __typename?: 'Phonenumber' }
    & Pick<Phonenumber, 'id' | 'country_code' | 'dial_code' | 'number' | 'label'>
  )>, nationalities: Array<(
    { __typename?: 'Nationality' }
    & Pick<Nationality, 'id' | 'name'>
  )>, location?: Maybe<(
    { __typename?: 'Location' }
    & Pick<Location, 'id' | 'full_address' | 'postal_code' | 'city' | 'country'>
  )>, industries: Array<(
    { __typename?: 'Industry' }
    & Pick<Industry, 'id' | 'title'>
  )>, skills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title'>
  )>, certifications: Array<(
    { __typename?: 'Certification' }
    & Pick<Certification, 'id' | 'title'>
  )>, it_skills: Array<(
    { __typename?: 'ItSkill' }
    & Pick<ItSkill, 'id' | 'title'>
  )>, cv_documents: Array<(
    { __typename?: 'Document' }
    & DocumentFragment
  )>, candidate_project_pivot?: Maybe<(
    { __typename?: 'CandidateProjectPivot' }
    & Pick<CandidateProjectPivot, 'status' | 'is_shortlisted' | 'purchasing_daily_rate' | 'retail_daily_rate' | 'basic_salary' | 'bonus_eur' | 'client_notes' | 'liked_by_client' | 'consent_sent_at' | 'consent_sent_to_email' | 'consented_at' | 'contradicted_at'>
  )>, events_in_project: Array<(
    { __typename?: 'Event' }
    & EventWithUserFragment
  )>, worked_at_companies: Array<(
    { __typename?: 'CandidateCompany' }
    & Pick<CandidateCompany, 'id' | 'from' | 'job_title' | 'job_level' | 'till'>
    & { company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'aliasOrName' | 'deleted_at'>
      & { logo?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    )> }
  )> }
);

export type GetCandidatesProjectsQueryVariables = Exact<{
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
}>;


export type GetCandidatesProjectsQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { placed_projects?: Maybe<(
        { __typename?: 'ProjectPaginator' }
        & { data: Array<(
          { __typename?: 'Project' }
          & Pick<Project, 'id' | 'title' | 'status' | 'is_interim' | 'is_permanent' | 'placed_start_at'>
          & { company: (
            { __typename?: 'Company' }
            & Pick<Company, 'id' | 'aliasOrName'>
            & { logo?: Maybe<(
              { __typename?: 'Image' }
              & Pick<Image, 'id'>
              & { sizes: (
                { __typename?: 'ImageSizes' }
                & { PROFILE_IMAGE?: Maybe<(
                  { __typename?: 'ImageSizeFormat' }
                  & ImageSizeFormatFragment
                )> }
              ) }
            )> }
          ), clients: Array<(
            { __typename?: 'Client' }
            & Pick<Client, 'id'>
            & { person: (
              { __typename?: 'Person' }
              & Pick<Person, 'id' | 'full_name'>
              & { foto?: Maybe<(
                { __typename?: 'Image' }
                & Pick<Image, 'id'>
                & { sizes: (
                  { __typename?: 'ImageSizes' }
                  & { PROFILE_IMAGE?: Maybe<(
                    { __typename?: 'ImageSizeFormat' }
                    & ImageSizeFormatFragment
                  )> }
                ) }
              )> }
            ) }
          )> }
        )>, paginatorInfo: (
          { __typename?: 'PaginatorInfo' }
          & PaginatorFragment
        ) }
      )> }
    )> }
  )> }
);

export type GetClientsProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsProjectsQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { client?: Maybe<(
      { __typename?: 'Client' }
      & Pick<Client, 'id'>
      & { active_projects?: Maybe<(
        { __typename?: 'ProjectPaginator' }
        & { data: Array<(
          { __typename?: 'Project' }
          & ClientProjectFragment
        )> }
      )>, runner_projects?: Maybe<(
        { __typename?: 'ProjectPaginator' }
        & { data: Array<(
          { __typename?: 'Project' }
          & ClientProjectFragment
        )> }
      )> }
    )> }
  )> }
);

export type ClientProjectFragment = (
  { __typename?: 'Project' }
  & Pick<Project, 'id' | 'title' | 'status' | 'is_interim' | 'is_permanent' | 'candidates_count' | 'shortlisted_candidates_count' | 'updated_at'>
  & { company: (
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'aliasOrName'>
    & { logo?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  ), clients: Array<(
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
    & { person: (
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'full_name'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ) }
  )>, users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'is_interim' | 'is_permanent' | 'title' | 'max_basic_salary' | 'max_bonus_eur' | 'is_business_car_included' | 'fee_structure' | 'max_daily_rate' | 'expenses_included' | 'retain' | 'project_start' | 'project_end' | 'placed_start_at' | 'notes' | 'ir_name' | 'ir_email' | 'ir_phone' | 'ir_vat' | 'ir_po' | 'ir_address' | 'deleted_at'>
    & { industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
    )>, company: (
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name'>
    ), clients: Array<(
      { __typename?: 'Client' }
      & Pick<Client, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'title' | 'firstname' | 'lastname'>
      ), client_project_pivot?: Maybe<(
        { __typename?: 'ClientProjectPivot' }
        & Pick<ClientProjectPivot, 'has_long_list_access'>
      )> }
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )>, users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
      & { pivot?: Maybe<(
        { __typename?: 'ProjectUserPivot' }
        & Pick<ProjectUserPivot, 'percent' | 'role'>
      )> }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )> }
  )> }
);

export type GetProjectByTokenQueryVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type GetProjectByTokenQuery = (
  { __typename?: 'Query' }
  & { getProjectByToken?: Maybe<(
    { __typename?: 'Project' }
    & { current_shared_link?: Maybe<(
      { __typename?: 'ProjectSharedLink' }
      & Pick<ProjectSharedLink, 'token' | 'is_longlist_shared'>
    )>, shortlisted_candidates: Array<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & CandidateInProjectForClientFragment
    )>, candidates: Array<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & CandidateInProjectForClientFragment
    )> }
    & ProjectDataForClientViewsFragment
  )> }
);

export type GetProjectForAddingCandidatesQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetProjectForAddingCandidatesQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'is_interim' | 'is_permanent' | 'title' | 'max_basic_salary' | 'max_bonus_eur' | 'is_business_car_included' | 'fee_structure' | 'max_daily_rate' | 'expenses_included' | 'project_start' | 'project_end'>
    & { industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title'>
      )> }
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title'>
      )> }
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'ItSkill' }
        & Pick<ItSkill, 'id' | 'title'>
      )> }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )> }
  )> }
);

export type GetProjectForCandidateQueryVariables = Exact<{
  projectId: Scalars['ObfId'];
}>;


export type GetProjectForCandidateQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'is_interim' | 'is_permanent' | 'title' | 'project_start' | 'project_end' | 'placed_start_at'>
    & { industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title'>
      )> }
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title'>
      )> }
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'ItSkill' }
        & Pick<ItSkill, 'id' | 'title'>
      )> }
    )>, company: (
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'aliasOrName'>
      & { logo?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ), clients: Array<(
      { __typename?: 'Client' }
      & Pick<Client, 'id' | 'position' | 'deleted_at'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'full_name'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & ImageSizeFormatFragment
            )> }
          ) }
        )> }
      ) }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )>, users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname' | 'contact_email' | 'contact_number'>
      & { foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    )>, placed_candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & PlacedCandidateFragment
    )> }
  )> }
);

export type GetProjectForClientQueryVariables = Exact<{
  projectId: Scalars['ObfId'];
}>;


export type GetProjectForClientQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & { shortlisted_candidates: Array<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & CandidateInProjectForClientFragment
    )>, candidates: Array<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & CandidateInProjectForClientFragment
    )>, placed_candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & PlacedCandidateFragment
    )> }
    & ProjectDataForClientViewsFragment
  )> }
);

export type GetProjectForViewQueryVariables = Exact<{
  projectId: Scalars['ObfId'];
}>;


export type GetProjectForViewQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'is_interim' | 'is_permanent' | 'title' | 'max_basic_salary' | 'max_bonus_eur' | 'is_business_car_included' | 'fee_structure' | 'max_daily_rate' | 'expenses_included' | 'retain' | 'project_start' | 'project_end' | 'placed_start_at' | 'status_note' | 'notes' | 'archived_at' | 'deleted_at'>
    & { industries: Array<(
      { __typename?: 'Industry' }
      & Pick<Industry, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Industry' }
        & Pick<Industry, 'id' | 'title'>
      )> }
    )>, skills: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title'>
      )> }
    )>, certifications: Array<(
      { __typename?: 'Certification' }
      & Pick<Certification, 'id' | 'title'>
    )>, it_skills: Array<(
      { __typename?: 'ItSkill' }
      & Pick<ItSkill, 'id' | 'title'>
      & { synonyms: Array<(
        { __typename?: 'ItSkill' }
        & Pick<ItSkill, 'id' | 'title'>
      )> }
    )>, company: (
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'aliasOrName' | 'deleted_at'>
      & { logo?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    ), clients: Array<(
      { __typename?: 'Client' }
      & Pick<Client, 'id' | 'position' | 'deleted_at' | 'user_id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'full_name'>
        & { foto?: Maybe<(
          { __typename?: 'Image' }
          & Pick<Image, 'id'>
          & { sizes: (
            { __typename?: 'ImageSizes' }
            & { PROFILE_IMAGE?: Maybe<(
              { __typename?: 'ImageSizeFormat' }
              & ImageSizeFormatFragment
            )> }
          ) }
        )> }
      ), client_project_pivot?: Maybe<(
        { __typename?: 'ClientProjectPivot' }
        & Pick<ClientProjectPivot, 'has_long_list_access'>
      )> }
    )>, documents: Array<(
      { __typename?: 'Document' }
      & DocumentFragment
    )>, users: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
      & { pivot?: Maybe<(
        { __typename?: 'ProjectUserPivot' }
        & Pick<ProjectUserPivot, 'percent' | 'role'>
      )>, foto?: Maybe<(
        { __typename?: 'Image' }
        & Pick<Image, 'id'>
        & { sizes: (
          { __typename?: 'ImageSizes' }
          & { PROFILE_IMAGE?: Maybe<(
            { __typename?: 'ImageSizeFormat' }
            & ImageSizeFormatFragment
          )> }
        ) }
      )> }
    )>, languages: Array<(
      { __typename?: 'Language' }
      & Pick<Language, 'code' | 'name'>
      & { language_pivot?: Maybe<(
        { __typename?: 'LanguagePivot' }
        & Pick<LanguagePivot, 'level'>
      )> }
    )>, client_events: Array<(
      { __typename?: 'Event' }
      & EventWithUserFragment
      & EventEventableFragment
    )>, shared_links: Array<(
      { __typename?: 'ProjectSharedLink' }
      & Pick<ProjectSharedLink, 'token' | 'guest_accesses' | 'expires_at' | 'password' | 'is_longlist_shared'>
    )>, histories: Array<(
      { __typename?: 'History' }
      & ModificationHistoryFragment
    )>, placed_candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & { events_in_project: Array<(
        { __typename?: 'Event' }
        & EventWithUserFragment
      )> }
      & PlacedCandidateFragment
    )>, revenues: Array<(
      { __typename?: 'Revenue' }
      & RevenueFragment
    )> }
  )> }
);

export type GetProjectsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  filter?: Maybe<ProjectsFilter>;
}>;


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projects?: Maybe<(
    { __typename?: 'ProjectPaginator' }
    & { data: Array<(
      { __typename?: 'Project' }
      & GetProjectsFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type GetProjectsForAutocompleteForLonglistQueryVariables = Exact<{
  candidateId: Scalars['ObfId'];
}>;


export type GetProjectsForAutocompleteForLonglistQuery = (
  { __typename?: 'Query' }
  & { projectsForAutocompleteForLonglist: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'title' | 'is_interim' | 'is_permanent' | 'status'>
    & { company: (
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form'>
    ) }
  )> }
);

export type GetProjectsForAutocompleteOnAddingToProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsForAutocompleteOnAddingToProjectQuery = (
  { __typename?: 'Query' }
  & { allProjects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'title' | 'is_interim' | 'is_permanent' | 'status'>
    & { company: (
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'legal_form'>
    ) }
  )> }
);

export type PauseProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type PauseProjectMutation = (
  { __typename?: 'Mutation' }
  & { pauseProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note'>
  )> }
);

export type ReactivateProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type ReactivateProjectMutation = (
  { __typename?: 'Mutation' }
  & { reactivateProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note'>
  )> }
);

export type RefreshDataAfterPlacingEventQueryVariables = Exact<{
  projectId: Scalars['ObfId'];
  candidate_id: Scalars['ObfId'];
}>;


export type RefreshDataAfterPlacingEventQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note' | 'placed_start_at'>
    & { candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id' | 'was_placed' | 'caution'>
      & { candidate_project_pivot?: Maybe<(
        { __typename?: 'CandidateProjectPivot' }
        & Pick<CandidateProjectPivot, 'status'>
      )> }
    )>, placed_candidate?: Maybe<(
      { __typename?: 'Candidate' }
      & PlacedCandidateFragment
    )> }
  )> }
);

export type RestoreProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type RestoreProjectMutation = (
  { __typename?: 'Mutation' }
  & { restoreProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
  )> }
);

export type ResumeProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  note?: Maybe<Scalars['String']>;
}>;


export type ResumeProjectMutation = (
  { __typename?: 'Mutation' }
  & { resumeProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'status' | 'status_note'>
  )> }
);

export type UnarchiveProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type UnarchiveProjectMutation = (
  { __typename?: 'Mutation' }
  & { unarchiveProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'archived_at'>
  )> }
);

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'id'>
  )> }
);

export type CreateRevenueMutationVariables = Exact<{
  input: CreateRevenueInput;
}>;


export type CreateRevenueMutation = (
  { __typename?: 'Mutation' }
  & { createRevenue?: Maybe<(
    { __typename?: 'Revenue' }
    & RevenueFragment
  )> }
);

export type DeleteRevenueMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteRevenueMutation = (
  { __typename?: 'Mutation' }
  & { deleteRevenue?: Maybe<(
    { __typename?: 'Revenue' }
    & Pick<Revenue, 'id'>
  )> }
);

export type GetRevenueQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetRevenueQuery = (
  { __typename?: 'Query' }
  & { revenue?: Maybe<(
    { __typename?: 'Revenue' }
    & { project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'is_interim' | 'is_permanent'>
      & { users: Array<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstname' | 'lastname'>
        & { pivot?: Maybe<(
          { __typename?: 'ProjectUserPivot' }
          & Pick<ProjectUserPivot, 'percent' | 'role'>
        )> }
      )> }
    ) }
    & RevenueFragment
  )> }
);

export type GetRevenueChartDataQueryVariables = Exact<{
  userId: Scalars['ObfId'];
  year?: Maybe<Scalars['Int']>;
}>;


export type GetRevenueChartDataQuery = (
  { __typename?: 'Query' }
  & { revenueChartData: Array<(
    { __typename?: 'RevenueChart' }
    & Pick<RevenueChart, 'id' | 'month' | 'year'>
    & { stats: (
      { __typename?: 'RevenueChartBreakout' }
      & Pick<RevenueChartBreakout, 'FORECAST' | 'READY_TO_INVOICE' | 'INVOICE_SENT' | 'PAID'>
    ) }
  )> }
);

export type GetRevenueChartDataSumQueryVariables = Exact<{
  year?: Maybe<Scalars['Int']>;
}>;


export type GetRevenueChartDataSumQuery = (
  { __typename?: 'Query' }
  & { revenueChartDataSum: Array<(
    { __typename?: 'RevenueChart' }
    & Pick<RevenueChart, 'id' | 'month' | 'year'>
    & { stats: (
      { __typename?: 'RevenueChartBreakout' }
      & Pick<RevenueChartBreakout, 'FORECAST' | 'READY_TO_INVOICE' | 'INVOICE_SENT' | 'PAID'>
    ) }
  )> }
);

export type GetRevenueInvoiceDataQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetRevenueInvoiceDataQuery = (
  { __typename?: 'Query' }
  & { revenue?: Maybe<(
    { __typename?: 'Revenue' }
    & Pick<Revenue, 'id' | 'month' | 'year' | 'type' | 'stage' | 'amount'>
    & { project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'ir_name' | 'ir_email' | 'ir_phone' | 'ir_vat' | 'ir_po' | 'ir_address' | 'title'>
      & { company: (
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'aliasOrName'>
      ) }
    ) }
  )> }
);

export type GetRevenuesQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  filter?: Maybe<RevenuesFilter>;
}>;


export type GetRevenuesQuery = (
  { __typename?: 'Query' }
  & { revenues?: Maybe<(
    { __typename?: 'RevenuePaginator' }
    & { data: Array<(
      { __typename?: 'Revenue' }
      & { project: (
        { __typename?: 'Project' }
        & Pick<Project, 'id' | 'title'>
        & { company: (
          { __typename?: 'Company' }
          & Pick<Company, 'id' | 'aliasOrName'>
          & { logo?: Maybe<(
            { __typename?: 'Image' }
            & Pick<Image, 'id'>
            & { sizes: (
              { __typename?: 'ImageSizes' }
              & { PROFILE_IMAGE?: Maybe<(
                { __typename?: 'ImageSizeFormat' }
                & ImageSizeFormatFragment
              )> }
            ) }
          )> }
        ) }
      ) }
      & RevenueFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpdateRevenueMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateRevenueInput;
}>;


export type UpdateRevenueMutation = (
  { __typename?: 'Mutation' }
  & { updateRevenue?: Maybe<(
    { __typename?: 'Revenue' }
    & RevenueFragment
  )> }
);

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = (
  { __typename?: 'Query' }
  & { reportReadyToInvoiceRevenueTo?: Maybe<(
    { __typename?: 'Setting' }
    & Pick<Setting, 'key' | 'value'>
  )> }
);

export type SetSettingsMutationVariables = Exact<{
  reportReadyToInvoiceRevenueTo?: Maybe<Scalars['JSON']>;
}>;


export type SetSettingsMutation = (
  { __typename?: 'Mutation' }
  & { reportReadyToInvoiceRevenueTo: (
    { __typename?: 'Setting' }
    & Pick<Setting, 'key' | 'value'>
  ) }
);

export type GeneratePublicDocumentLinkMutationVariables = Exact<{
  document_id: Scalars['ObfId'];
  expires_after_days: Scalars['Int'];
}>;


export type GeneratePublicDocumentLinkMutation = (
  { __typename?: 'Mutation' }
  & { generatePublicDocumentLink: (
    { __typename?: 'SharedLink' }
    & Pick<SharedLink, 'id' | 'URL' | 'token' | 'views' | 'expires_at'>
  ) }
);

export type GetSharedLinksOfDocumentQueryVariables = Exact<{
  document_id: Scalars['ObfId'];
}>;


export type GetSharedLinksOfDocumentQuery = (
  { __typename?: 'Query' }
  & { getSharedLinksOfDocument: Array<(
    { __typename?: 'SharedLink' }
    & Pick<SharedLink, 'id' | 'URL' | 'token' | 'views' | 'expires_at'>
  )> }
);

export type CreateSkillMutationVariables = Exact<{
  input: CreateSkillInput;
}>;


export type CreateSkillMutation = (
  { __typename?: 'Mutation' }
  & { createSkill: (
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type DeleteSkillMutationVariables = Exact<{
  id: Scalars['ObfId'];
  transferLinkedDataTo?: Maybe<Scalars['ObfId']>;
}>;


export type DeleteSkillMutation = (
  { __typename?: 'Mutation' }
  & { deleteSkill?: Maybe<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id'>
  )> }
);

export type GetAllSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSkillsQuery = (
  { __typename?: 'Query' }
  & { allSkills: Array<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
  )> }
);

export type GetSkillForEditQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetSkillForEditQuery = (
  { __typename?: 'Query' }
  & { skill?: Maybe<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title' | 'is_reviewed' | 'parent_id'>
    & { synonym_representative?: Maybe<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )>, parent?: Maybe<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )>, children: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title'>
    )> }
  )> }
);

export type GetSkillForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetSkillForViewQuery = (
  { __typename?: 'Query' }
  & { skill?: Maybe<(
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title' | 'is_reviewed' | 'synonym_representative_id'>
    & { synonyms: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title' | 'synonym_representative_id' | 'is_reviewed'>
    )>, parent?: Maybe<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
    )>, children: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
      & { synonyms: Array<(
        { __typename?: 'Skill' }
        & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
      )> }
    )> }
  )> }
);

export type GetSkillsQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  is_reviewed?: Maybe<Scalars['Boolean']>;
}>;


export type GetSkillsQuery = (
  { __typename?: 'Query' }
  & { skills?: Maybe<(
    { __typename?: 'SkillPaginator' }
    & { data: Array<(
      { __typename?: 'Skill' }
      & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type UpdateSkillMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateSkillInput;
}>;


export type UpdateSkillMutation = (
  { __typename?: 'Mutation' }
  & { updateSkill: (
    { __typename?: 'Skill' }
    & Pick<Skill, 'id' | 'title' | 'is_reviewed'>
  ) }
);

export type GetLicenseQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLicenseQuery = (
  { __typename?: 'Query' }
  & { license?: Maybe<(
    { __typename?: 'StellaLicense' }
    & Pick<StellaLicense, 'id' | 'client_name' | 'host' | 'is_active' | 'plugins' | 'users_limit' | 'logo_url'>
  )> }
);

export type ChangeUserPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangeUserPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changeUserPassword'>
);

export type CreateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type DashboardDataQueryVariables = Exact<{
  where?: Maybe<UserRevenuesWhereWhereConditions>;
}>;


export type DashboardDataQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { revenues: Array<(
      { __typename?: 'Revenue' }
      & RevenueFragment
    )> }
  )> }
);

export type DashboardUpcomingEventsQueryVariables = Exact<{
  onlyDay?: Maybe<Scalars['DateRequestTz']>;
}>;


export type DashboardUpcomingEventsQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { events: Array<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'happened_at' | 'group' | 'type' | 'notes'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id'>
      )> }
      & EventEventableFragment
    )> }
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type GetUserQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname' | 'contact_email' | 'contact_number' | 'email' | 'roles'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id' | 'original_image'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
          & CropPropsFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetUserForViewQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetUserForViewQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname' | 'contact_email' | 'contact_number' | 'email' | 'roles' | 'created_at'>
    & { foto?: Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'id'>
      & { sizes: (
        { __typename?: 'ImageSizes' }
        & { PROFILE_IMAGE?: Maybe<(
          { __typename?: 'ImageSizeFormat' }
          & ImageSizeFormatFragment
        )> }
      ) }
    )> }
  )> }
);

export type GetUserWithStatsQueryVariables = Exact<{
  id: Scalars['ObfId'];
  from: Scalars['DateRequestTz'];
  till: Scalars['DateRequestTz'];
}>;


export type GetUserWithStatsQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstname' | 'lastname'>
    & { stats: (
      { __typename?: 'UserStats' }
      & { createdCandidates: Array<(
        { __typename?: 'Candidate' }
        & GetCandidatesFragment
      )>, createdClients: Array<(
        { __typename?: 'Client' }
        & GetClientsFragment
      )>, createdCompanies: Array<(
        { __typename?: 'Company' }
        & GetCompaniesFragment
      )>, createdProjects: Array<(
        { __typename?: 'Project' }
        & GetProjectsFragment
      )>, createdEvents: Array<(
        { __typename?: 'Event' }
        & EventWithUserAndProjectAndEventableFragment
      )>, happenedEvents: Array<(
        { __typename?: 'Event' }
        & EventWithUserAndProjectAndEventableFragment
      )> }
    ) }
  )> }
);

export type GetUsersQueryVariables = Exact<{
  orderBy?: Maybe<Array<OrderByClause>>;
  first: Scalars['Int'];
  page?: Maybe<Scalars['Int']>;
  where?: Maybe<QueryUsersWhereWhereConditions>;
  roles?: Maybe<Array<UserRole>>;
}>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<(
    { __typename?: 'UserPaginator' }
    & { data: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname' | 'email' | 'roles' | 'created_at'>
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & PaginatorFragment
    ) }
  )> }
);

export type IsResetPasswordTokenValidQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type IsResetPasswordTokenValidQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isResetPasswordTokenValid'>
);

export type RequestPasswordResettingMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type RequestPasswordResettingMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'requestPasswordResetting'>
);

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ObfId'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type UsersStatsCountQueryVariables = Exact<{
  from: Scalars['DateRequestTz'];
  till: Scalars['DateRequestTz'];
}>;


export type UsersStatsCountQuery = (
  { __typename?: 'Query' }
  & { usersStatsCount: Array<(
    { __typename?: 'UserStatsCount' }
    & Pick<UserStatsCount, 'createdCandidates' | 'createdClients' | 'createdCompanies' | 'createdProjects' | 'createdEvents' | 'happenedEvents'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstname' | 'lastname'>
    ) }
  )> }
);

export type ApproveWorkingHoursMutationVariables = Exact<{
  id: Scalars['ObfId'];
  status_note?: Maybe<Scalars['String']>;
}>;


export type ApproveWorkingHoursMutation = (
  { __typename?: 'Mutation' }
  & { approveWorkingHours: (
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  ) }
);

export type CreateWorkingHoursMutationVariables = Exact<{
  input: CreateWorkingHoursInput;
}>;


export type CreateWorkingHoursMutation = (
  { __typename?: 'Mutation' }
  & { createWorkingHours?: Maybe<(
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  )> }
);

export type DeclineWorkingHoursMutationVariables = Exact<{
  id: Scalars['ObfId'];
  status_note?: Maybe<Scalars['String']>;
}>;


export type DeclineWorkingHoursMutation = (
  { __typename?: 'Mutation' }
  & { declineWorkingHours: (
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  ) }
);

export type DeleteWorkingHoursMutationVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type DeleteWorkingHoursMutation = (
  { __typename?: 'Mutation' }
  & { deleteWorkingHours?: Maybe<(
    { __typename?: 'WorkingHours' }
    & Pick<WorkingHours, 'id'>
  )> }
);

export type GetWorkingHoursForProofQueryVariables = Exact<{
  id: Scalars['ObfId'];
}>;


export type GetWorkingHoursForProofQuery = (
  { __typename?: 'Query' }
  & { workingHours?: Maybe<(
    { __typename?: 'WorkingHours' }
    & Pick<WorkingHours, 'id' | 'billing_type' | 'retail_per_unit' | 'requested_at' | 'client_approved_at' | 'client_declined_at' | 'candidate_approved_at' | 'candidate_declined_at' | 'status' | 'status_note'>
    & { units: Array<(
      { __typename?: 'WorkingHoursUnit' }
      & Pick<WorkingHoursUnit, 'date' | 'hours' | 'note'>
    )>, project: (
      { __typename?: 'Project' }
      & Pick<Project, 'id' | 'title' | 'placed_start_at'>
      & { company: (
        { __typename?: 'Company' }
        & Pick<Company, 'id' | 'complete_name'>
      ) }
    ), candidate: (
      { __typename?: 'Candidate' }
      & Pick<Candidate, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'full_name'>
      ) }
    ), client?: Maybe<(
      { __typename?: 'Client' }
      & Pick<Client, 'id'>
      & { person: (
        { __typename?: 'Person' }
        & Pick<Person, 'id' | 'full_name'>
      ) }
    )> }
  )> }
);

export type ModifyWorkingHoursByClientMutationVariables = Exact<{
  input: UpdateWorkingHoursInput;
}>;


export type ModifyWorkingHoursByClientMutation = (
  { __typename?: 'Mutation' }
  & { modifyWorkingHoursByClient: (
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  ) }
);

export type SubmitWorkingHoursRequestToClientMutationVariables = Exact<{
  input: UpdateWorkingHoursInput;
}>;


export type SubmitWorkingHoursRequestToClientMutation = (
  { __typename?: 'Mutation' }
  & { submitWorkingHoursRequestToClient: (
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  ) }
);

export type UpdateWorkingHoursMutationVariables = Exact<{
  input: UpdateWorkingHoursInput;
}>;


export type UpdateWorkingHoursMutation = (
  { __typename?: 'Mutation' }
  & { updateWorkingHours?: Maybe<(
    { __typename?: 'WorkingHours' }
    & WorkingHoursFragment
  )> }
);
