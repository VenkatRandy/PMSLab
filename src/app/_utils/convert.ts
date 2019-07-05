import { ReviewData } from '../_models/responses';
import { Data, TemplateRequests } from '../_models/requests';

export function convertToRequests(reviewData) {
  // let data = new ReviewData(reviewData);
  let data = new Data();
  data.setReviewType = reviewData.reviewType;
  let templateRequests = new TemplateRequests();
  if (reviewData.templateResponses) {
    for (let z = 0; z < reviewData.templateResponses.length; z++) {
      let templateRequest = reviewData.templateResponses[z];
      templateRequests.setRoleType = templateRequest.roleType;
      templateRequests.setEmployeeRating = templateRequest.employeeRating;
      templateRequests.setLevel1Rating = templateRequest.level1Rating;
      templateRequests.setLevel2Rating = templateRequest.level2Rating;
      templateRequests.setLevel3Rating = templateRequest.level3Rating;
      templateRequests.setEmployeeComments = templateRequest.employeeComments;
      templateRequests.setLevel1Comments = templateRequest.level1Comments;
      templateRequests.setLevel2Comments = templateRequest.level2Comments;
      templateRequests.setLevel3Comments = templateRequest.level3Comments;
      templateRequests.setPostReviewRevieweeComments = templateRequest.postReviewRevieweeComments;
      templateRequests.setPostReviewRevieweeComments = templateRequest.postReviewRevieweeComments;
    }
  }
  // data.setTemplateRequests = reviewData.templateResponses;
  console.log(data);
  // return data;
}






















export const reviewData = {
  "data": {
    "reviewType": "Annual",
    "code": null,
    "responseDescription": null,
    "responseStatus": null,
    "templateResponses": [
      {
        "roleType": null,
        "employeeRating": 72,
        "level1Rating": 29,
        "level2Rating": 27,
        "level3Rating": 42,
        "employeeComments": null,
        "level1Comments": null,
        "level2Comments": null,
        "level3Comments": null,
        "postReviewRevieweeComments": null,
        "categoryResponses": [
          {
            "name": "Client",
            "weightage": 60,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Feedback from Client",
                "description": "Feedback from Client/Onsite account managers, Appreciation/Recognition from clients                                              No Positive or Negative feedback will be treated as 3 out of 5",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "15",
                            "level1": "5",
                            "level2": "2",
                            "level3": "15"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Min 4 out of 5 on a 1 to 5 scale"
              },
              {
                "name": "Escalations from client",
                "description": "No. of valid escalations from client related to employee's work",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "15",
                            "level1": "2",
                            "level2": "5",
                            "level3": "2"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "No Critical Escalation and upto 1 non-critical escalation / year"
              },
              {
                "name": "Innovations and Value additions",
                "description": "Innovations and Value additions ( Business Process Improvements, Technical Suggestions, Permanent solutions to problems,  etc.) to client (including those not accepted by Client)",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "15",
                            "level1": "2",
                            "level2": "1",
                            "level3": "2"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "At least 2 per year"
              }
            ],
            "textResponse": null
          },
          {
            "name": "Delivery (Depending on the nature of work, the KRAs may be replaced with more appropriate ones)",
            "weightage": 10,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Adherence to Schedules",
                "description": "Adherence to Schedules - Schedule adherence = 100 - (No.of instances when delivery was delayed beyond agreed/expected schedule/ Total no. of instances)*100",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "2",
                            "level3": "6"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "98%"
              },
              {
                "name": "Adherence to estimated Effort",
                "description": "Adherence to estimated Effort/cost - Effort/Cost adherence = 100 - (No.of instances when delivery was made exceeding the agreed/expected effort or cost/ Total no. of instances)*100",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "1",
                            "level3": "3"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "98%"
              },
              {
                "name": "Adherence to standards",
                "description": "Adherence to defined standards - Standards adherence = 100 - (No.of instances when delivery was made involving non-compliance to standards/ Total no. of instances)*100",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "1",
                            "level3": "0"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "99%"
              },
              {
                "name": "Service Level adherence",
                "description": "Service Level/Resolution time  for production support - Service Level adherence = 100 - (No.of instances Service levels were missed or resolution was delayed beyond expectations/ Total no. of instances)*100",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "1",
                            "level3": "0"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "99%"
              }
            ],
            "textResponse": null
          },
          {
            "name": "QA",
            "weightage": 5,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "No. of defects",
                "description": "No. of defects found by Client QA",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "2",
                            "level3": "3"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "No. of P1(Show-stoppers) defects found by Client QA"
              },
              {
                "name": "No. of defects found by Internal QA",
                "description": "No. of defects found by Internal QA/Client QA : 100 - (No of Defective deliverables/Total no. of deliverables)*100",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "1",
                            "level3": "1"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "98% non-defective deliverables"
              },
              {
                "name": "Adherence to processes",
                "description": "Adherence to processes both internal and client - No. of  instances when was delivery was made with agreed compliance/ Total no. of instances",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "0",
                            "level1": "0",
                            "level2": "1",
                            "level3": "0"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "99%"
              }
            ],
            "textResponse": null
          },
          {
            "name": "Personal",
            "weightage": 10,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Communication skills",
                "description": "Communication skills :  5 - Able to communicate very effectively (both written and verbal) with all including Client and impress upon them 4 - Able to communicate well (both written and verbal) with all including Client 3 - Manages to communicate",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "dropdown",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": [
                        {
                          "key": "5",
                          "value": "5"
                        },
                        {
                          "key": "4",
                          "value": "4"
                        },
                        {
                          "key": "3",
                          "value": "3"
                        },
                        {
                          "key": "2",
                          "value": "2"
                        },
                        {
                          "key": "1",
                          "value": "1"
                        },
                        {
                          "key": "0",
                          "value": "0"
                        }
                      ]
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "dropdown",
                          "textResponse": null,
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "2",
                            "level3": "3"
                          },
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Min 4 out of 5 on a 1 to 5 scale"
              },
              {
                "name": "Inter-personal skills",
                "description": "Inter-personal skills - 5 - Able to work with all with no inter-personal issues; Liked by all 4 - Able to work with all and resolve inter-personal issues on his/her own 3 - Occasional inter-personal conflicts which need intervention 2 - Quite often g",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "dropdown",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": [
                        {
                          "key": "5",
                          "value": "5"
                        },
                        {
                          "key": "4",
                          "value": "4"
                        },
                        {
                          "key": "3",
                          "value": "3"
                        },
                        {
                          "key": "2",
                          "value": "2"
                        },
                        {
                          "key": "1",
                          "value": "1"
                        },
                        {
                          "key": "0",
                          "value": "0"
                        }
                      ]
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "dropdown",
                          "textResponse": null,
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": {
                            "employee": "4",
                            "level1": "1",
                            "level2": "2",
                            "level3": "2"
                          },
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Min 4 out of 5 on a 1 to 5 scale"
              },
              {
                "name": "Discipline",
                "description": "Discipline  - Adherence to office timings, Dress code. Planned Leave Requests, Punctual to the Meetings  and  Oganizational Process & Policies",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "2",
                            "level2": "0",
                            "level3": "2"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "100%"
              },
              {
                "name": "Initiative",
                "description": "Initiative for self development",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "0",
                            "level2": "2",
                            "level3": "1"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "At least 50 hours of training per year and One certification per year"
              }
            ],
            "textResponse": null
          },
          {
            "name": "Corporate",
            "weightage": 15,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Contribution to Organizational Assets",
                "description": "Contribution to Organizational Assets - Creation of IP, Reusable Artifacts, Best Practises",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "text",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "2",
                            "level1": "1",
                            "level2": "2",
                            "level3": "2"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Two instances per year"
              },
              {
                "name": "Assist other project teams",
                "description": "Provide / Assist other project teams during need or Crisis , Support Client visits, proposals and support POC; Participate in Hiring drives; Assist in conducting training programs, Participate in other similar organizational support activities",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Achievement Against Goals",
                      "type": "text",
                      "columnName": "Achievement Against Goals",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Description of achievements",
                      "type": "text",
                      "columnName": "Description of achievements",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Weightage",
                      "type": "dropdown",
                      "columnName": "Weightage",
                      "dropDownDefaultResponses": [
                        {
                          "key": "5",
                          "value": "5"
                        },
                        {
                          "key": "4",
                          "value": "4"
                        },
                        {
                          "key": "3",
                          "value": "3"
                        },
                        {
                          "key": "2",
                          "value": "2"
                        },
                        {
                          "key": "1",
                          "value": "1"
                        },
                        {
                          "key": "0",
                          "value": "0"
                        }
                      ]
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "dropdown",
                          "textResponse": null,
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": {
                            "employee": "3",
                            "level1": "2",
                            "level2": "2",
                            "level3": "0"
                          },
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Min 4 out of 5 on a 1 to 5 scale"
              }
            ],
            "textResponse": null
          },
          {
            "name": "Recommendations",
            "weightage": 0,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Recommendations",
                "description": "Training /Coaching/Mentoring Recommendations",
                "type": "table",
                "textResponse": null,
                "textAreaResponse": null,
                "tableResponse": {
                  "tableHeaderResponses": [
                    {
                      "description": "Type of Learning",
                      "type": "text",
                      "columnName": "Type of Learning",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Topic",
                      "type": "text",
                      "columnName": "Topic",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "To be Completed by",
                      "type": "date",
                      "columnName": "To be Completed by",
                      "dropDownDefaultResponses": null
                    },
                    {
                      "description": "Remarks",
                      "type": "text",
                      "columnName": "Remarks",
                      "dropDownDefaultResponses": null
                    }
                  ],
                  "tableValueListResponses": [
                    {
                      "tableValueResponses": [
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        },
                        {
                          "type": "date",
                          "textResponse": null,
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": {
                            "employee": "2019-07-24",
                            "level1": "2026-05-27",
                            "level2": "2019-07-25",
                            "level3": "2020-03-27"
                          }
                        },
                        {
                          "type": "text",
                          "textResponse": {
                            "employee": "and since that time the organisation has experienced incredible growth.",
                            "level1": "story of The Encore Organisation began with the incorporation of the very",
                            "level2": "began with the incorporation of the very",
                            "level3": "incorporation of the very  first-marketing \"company\" in july 2011"
                          },
                          "textAreaResponse": null,
                          "dropDownSelectedResponse": null,
                          "dateResponse": null
                        }
                      ]
                    }
                  ]
                },
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Training /Coaching/Mentoring Recommendations"
              }
            ],
            "textResponse": null
          },
          {
            "name": "Summary",
            "weightage": 0,
            "weightageAgainstKRA": false,
            "subCategoryResponses": [
              {
                "name": "Summary of Points",
                "description": "Summary of Points Discussed during Review",
                "type": "textarea",
                "textResponse": null,
                "textAreaResponse": {
                  "employee": "and since that time the organisation has experienced incredible growth.",
                  "level1": "story of The Encore Organisation began with the incorporation of the very",
                  "level2": "began with the incorporation of the very",
                  "level3": "incorporation of the very\n first-marketing \"company\" in july 2011"
                },
                "tableResponse": null,
                "dropDownResponse": null,
                "dateResponse": null,
                "goal": "Summary of Points Discussed during Review"
              }
            ],
            "textResponse": null
          }
        ],
        "submitted": {
          "employee": "Closed",
          "level1": "Closed",
          "level2": "Closed",
          "level3": "Closed"
        }
      }
    ]
  }
}