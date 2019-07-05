export class ReviewData {
  data: Data;
  constructor() {

  }
}
export class Data {
  private reviewType: string;
  private templateRequests: TemplateRequests[];
  constructor() {

  }
  get getReviewType(): string {
    return this.reviewType;
  }
  set setReviewType(reviewType: string) {
    this.reviewType = reviewType;
  }
  get getTemplateRequests(): TemplateRequests[] {
    return this.templateRequests;
  }
  set setTemplateRequests(templateRequests: TemplateRequests[]) {
    this.templateRequests = templateRequests;
  }
}
export class TemplateRequests {
  roleType?: string | null;
  employeeRating: string | number | null;
  level1Rating: string | number | null;
  level2Rating: string | number | null;
  level3Rating: string | number | null;
  employeeComments: string | null;
  level1Comments: string | null;
  level2Comments: string | null;
  level3Comments: string | null;
  postReviewRevieweeComments?: string | null;
  submitted: Levels | null;
  categoryRequests?: CategoryRequests[] | null;
  constructor() {

  }
  get getRoleType(): string | null {
    return this.roleType;
  }
  set setRoleType(roleType: string | null) {
    this.roleType = roleType;
  }
  get getEmployeeRating(): string | number | null {
    return this.employeeRating;
  }
  set setEmployeeRating(employeeRating: string | number | null) {
    this.employeeRating = employeeRating;
  }
  get getLevel1Rating(): string | number | null {
    return this.level1Rating;
  }
  set setLevel1Rating(level1Rating: string | number | null) {
    this.level1Rating = level1Rating;
  }
  get getLevel2Rating(): string | number | null {
    return this.level2Rating;
  }
  set setLevel2Rating(level2Rating: string | number | null) {
    this.level2Rating = level2Rating;
  }
  get getLevel3Rating(): string | number | null {
    return this.level3Rating;
  }
  set setLevel3Rating(level3Rating: string | number | null) {
    this.level3Rating = level3Rating;
  }
  get getEmployeeComments(): string | null {
    return this.employeeComments;
  }
  set setEmployeeComments(employeeComments: string | null) {
    this.employeeComments = employeeComments;
  }
  get getLevel1Comments(): string | null {
    return this.level1Comments;
  }
  set setLevel1Comments(level1Comments: string | null) {
    this.level1Comments = level1Comments;
  }
  get getLevel2Comments(): string | null {
    return this.level2Comments;
  }
  set setLevel2Comments(level2Comments: string | null) {
    this.level2Comments = level2Comments;
  }
  get getLevel3Comments(): string | null {
    return this.level3Comments;
  }
  set setLevel3Comments(level3Comments: string | null) {
    this.level3Comments = level3Comments;
  }
  get getPostReviewRevieweeComments(): string | null {
    return this.postReviewRevieweeComments;
  }
  set setPostReviewRevieweeComments(postReviewRevieweeComments: string | null) {
    this.postReviewRevieweeComments = postReviewRevieweeComments;
  }
  get getSubmitted(): Levels | null {
    return this.submitted;
  }
  set setSubmitted(submitted: Levels | null) {
    this.submitted = submitted;
  }
  get getCategoryRequests(): CategoryRequests[] | null {
    return this.categoryRequests;
  }
  set setCategoryRequests(categoryRequests: CategoryRequests[] | null) {
    this.categoryRequests = categoryRequests;
  }
}
export class CategoryRequests {
  name: string;
  weightage: number;
  weightageAgainstKRA: boolean;
  subCategoryResponses?: (SubCategoryResponsesEntity)[] | null;
  textResponse?: null;
}
export interface SubCategoryResponsesEntity {
  name: string;
  description: string;
  type: string;
  textResponse?: null;
  textAreaResponse?: TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted1 | null;
  tableResponse?: TableResponse | null;
  dropDownResponse?: null;
  dateResponse?: null;
  goal: string;
}
export interface TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted1 {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}
export interface TableResponse {
  tableHeaderResponses?: (TableHeaderResponsesEntity)[] | null;
  tableValueListResponses?: (TableValueListResponsesEntity)[] | null;
}
export interface TableHeaderResponsesEntity {
  description: string;
  type: string;
  columnName: string;
  dropDownDefaultResponses?: (DropDownDefaultResponsesEntity)[] | null;
}
export interface DropDownDefaultResponsesEntity {
  key: string;
  value: string;
}
export interface TableValueListResponsesEntity {
  tableValueResponses?: (TableValueResponsesEntity)[] | null;
}
export interface TableValueResponsesEntity {
  type: string;
  textResponse?: TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted2 | null;
  textAreaResponse?: null;
  dropDownSelectedResponse?: TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted3 | null;
  dateResponse?: TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted4 | null;
}
export interface TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted2 {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}
export interface TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted3 {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}
export interface TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted4 {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}
export class Levels {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}