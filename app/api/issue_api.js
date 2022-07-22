import { localhost } from "../config/configurations";
import { get_user } from "./user_api";

/*
Get an issue
Use api_key to get private issue
*/
export const get_issue = async (issue_id) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'issues/' + issue_id + '.json', {
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': user.api_key,
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

/*
Get all issues assigned to user
Use api_key to get private issues
*/
export const get_issues = async () => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'issues.json?assigned_to_id=' + user.id + '&status_id=*', {
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': user.api_key,
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

/*
Create an issue
*/
export const create_issue = async (body) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'issues.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': user.api_key,
      },
      body: body
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

/*
Update an issue
*/
export const update_issue = async (issue_id, body) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'issues/' + issue_id + '.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': user.api_key,
      },
      body: body
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
