export class ReviewData {
  data: Data;
  constructor(data: Data) {
    this.data = data;
  }
}
export class Data {
  private reviewType: string;
  private templateResponses: TemplateResponses[];
  get getReviewType(): string {
    return this.reviewType;
  }
  set setReviewType(reviewType: string) {
    this.reviewType = reviewType;
  }
  get getTemplateResponses(): TemplateResponses[] {
    return this.templateResponses;
  }
  set setTemplateResponses(templateResponses: TemplateResponses[]) {
    this.templateResponses = templateResponses;
  }
}
export class TemplateResponses {
  roleType?: null;
  employeeRating: number;
  level1Rating: number;
  level2Rating: number;
  level3Rating: number;
  employeeComments?: null;
  level1Comments?: null;
  level2Comments?: null;
  level3Comments?: null;
  postReviewRevieweeComments?: null;
  categoryResponses?: (CategoryResponsesEntity)[] | null;
  submitted: TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted;
}
export interface CategoryResponsesEntity {
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
export interface TextResponseOrDropDownSelectedResponseOrDateResponseOrTextAreaResponseOrSubmitted {
  employee: string;
  level1: string;
  level2: string;
  level3: string;
}