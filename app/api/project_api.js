import { localhost } from "../config/configurations";
import { get_user } from "./user_api";

/*
Get a project
Use api_key to get private project
*/
export const get_project = async (project_id) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects/' + project_id + '.json', {
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
Get all projects
Use api_key to get private projects
*/
export const get_projects = async () => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects.json', {
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
Get all issues of a project
Use api_key to get private issues
*/
export const get_issues_of_project = async (project_id) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'issues.json?project_id=' + project_id + '&status_id=*', {
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
Create a project
*/
export const create_project = async (body) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects.json', {
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
Update a project
*/
export const update_project = async (project_id, body) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects/' + project_id + '.json', {
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
