function getFilterString(filters = {}) {
  let filterEntries = Object.entries(filters);
  let filterString = '';
  if (filterEntries.length == 0) return filterString;
  filterString += '?';
  for (let [index,value] of filterEntries) {
    filterString += `${index}=${value}&`
  }
  return filterString.slice(0, -1);
}

function requestPages(url, key, continuation = []) {
  const output = document.getElementById('loading-output');
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`
      }
    }).then(res => res.json()).then(json => {
      let pages = json.pages;
      if (!pages) {
        resolve(json.data);
      }
      for (let data of json.data) {
        continuation.push(data)
      }
      let nextURL = pages.next_url;
      if (nextURL == null) {
        //output.innerHTML = '';
        resolve(continuation);
        return;
      }
      output.innerHTML = `${output.innerHTML}\n${nextURL}`;
      requestPages(nextURL, key, continuation).then(result => {
        resolve(result);
      })
    }).catch(error => {
      reject(error);
    }).catch(error => {
      reject(error);
    });
  });
}

function requestReviews(key, filters = {}) {
  return requestPages(`https://api.wanikani.com/v2/review_statistics${getFilterString(filters)}`,key);
}

function requestSubjects(key, filters = {}) {
  return requestPages(`https://api.wanikani.com/v2/subjects${getFilterString(filters)}`,key);
}

function getTestableSubjects(key, subjectFilters = {}, reviewFilters = {}) {
  const output = document.getElementById('loading-output');
  return new Promise((resolve, reject) => {
    output.innerHTML = 'Loading subjects...';
    requestSubjects(key,subjectFilters).then(subjectResults => {
      if (subjectResults.error) {
        let errorMessage = `Error ${subjectResults.code}: ${subjectResults.error}`;
        output.innerHTML = errorMessage;
        reject(errorMessage);
      }
      output.innerHTML = `${subjectResults.length.toString()} subjects found.\nComparing with available reviews...`;
      requestReviews(key, reviewFilters).then(reviewResults => {
        if (reviewResults.error) {
          let errorMessage = `Error ${reviewResults.code}: ${reviewResults.error}`;
          output.innerHTML = errorMessage;
          reject(errorMessage);
        }
        output.innerHTML = `${reviewResults.length.toString()} reviews found.`;
        let subjects = subjectResults.filter(sResult => {
          let validResults = reviewResults.find(rResult => {
            let isValid = rResult.data.subject_id == sResult.id && sResult.data.characters;
            return isValid;
          });
          return validResults;
        });
        output.innerHTML = `${subjects.length.toString()} testable subjects found.`;
        resolve(subjects);
      }).catch(error => {
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
}

function getUserInfo(key) {
  return new Promise((resolve,reject) => {
    fetch('https://api.wanikani.com/v2/user',{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`
      }
    }).then(res => res.json()).then(json => {
      if (json.error) {
        reject(`Error ${json.code}: ${json.error}`);
        return;
      }
      resolve({
        username: json.data.username,
        level: json.data.level
      });
    }).catch(error => {
      reject(error);
    }).catch(error => {
      reject(error);
    });
  });
}