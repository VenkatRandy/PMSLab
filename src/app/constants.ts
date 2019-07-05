export class AppConstants {
  public static get baseURLPMS(): string {
    // return "http://localhost:8080/api/pms/";

    // QA
    return localStorage.getItem('API_BASE_PATH_PMS') || "http://pmsqa.encoress.com/pmsapi/api/pms/";

    //Prod
    // return localStorage.getItem('API_BASE_PATH_PMS') || "http://192.168.1.41:8085/pmsapi/api/pms/";
  }

  public static get baseURLAPPS(): string {

    // return "http://localhost:8085/pms/";

    // QA
    return localStorage.getItem('API_BASE_PATH_APPS') || "http://saasadmin.encoress.com/saasadmin/pms/";

    //Prod
    //return window.localStorage.getItem('API_BASE_PATH') || "http://ams.encoress.com/api";
  }
}