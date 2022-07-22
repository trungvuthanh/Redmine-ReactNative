import { localhost } from "../config/configurations";
import { get_user } from "./user_api";

/*
Get memberships of a project
*/
export const get_memberships = async (project_id) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects/' + project_id + '/memberships.json', {
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
Add a member to project
*/
export const add_membership = async (project_id, body) => {
  try {
    let user = await get_user();
    let response = await fetch(localhost + 'projects/' + project_id + '/memberships.json', {
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
