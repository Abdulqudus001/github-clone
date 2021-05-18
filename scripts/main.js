const nav = document.querySelector('.nav');
const loader = document.querySelector('.loader');

const toggleNav = () => {
  nav.classList.toggle('open');
};

const renderTopics = ({ edges }) => {
  console.log(edges);
  if (edges.length < 1) {
    return null;
  } else {
    const repositoryTopics = document.createElement('div');
    repositoryTopics.classList.add('repository__topics');

    edges.forEach(({ node }) => {
      const { topic: { name }, url} = node;
      console.log(url);
      const singleRepositoryTopic = document.createElement('a');
      singleRepositoryTopic.setAttribute('href', url);
      singleRepositoryTopic.setAttribute('target', '_blank');
      singleRepositoryTopic.classList.add('repository__topic');
      singleRepositoryTopic.textContent = name;
      repositoryTopics.appendChild(singleRepositoryTopic);
    });

    return repositoryTopics;
  }
}

const createRepository = (repository) => {
  const link = document.createElement('a');
  link.classList.add('repository__title');
  link.setAttribute('href', `https://github.com${repository.resourcePath}`);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = repository.name;

  const description = document.createElement('p');
  description.classList.add('repository__description');
  description.textContent = repository.description;

  // Render repository topics
  const topics = renderTopics(repository.repositoryTopics);

  const updated = document.createElement('p');
  updated.classList.add('updated');
  updated.textContent = `updated ${format(new Date(repository.pushedAt))}`;

  // Repository Language
  const language = document.createElement('div');
  language.classList.add('language');

  const languageName = document.createElement('span');
  languageName.textContent = repository.primaryLanguage && repository.primaryLanguage.name;

  const languageColor = document.createElement('div');
  languageColor.classList.add('language__color');
  languageColor.style.backgroundColor = repository.primaryLanguage && repository.primaryLanguage.color;

  language.append(languageColor, languageName);
  // End of repository language

  // Star counts
  const starCount = document.createElement('span');
  starCount.classList.add('count', 'count--star');

  const starImg = document.createElement('img');
  starImg.setAttribute('src', '/images/star.svg');

  const starNum = document.createElement('p');
  starNum.textContent = repository.stargazerCount;

  starCount.append(starImg, starNum);
  // End of star count

  // Fork counts
  const forkCount = document.createElement('span');
  forkCount.classList.add('count', 'count--fork');

  const forkImg = document.createElement('img');
  forkImg.setAttribute('src', '/images/fork.svg');

  const forkNum = document.createElement('p');
  forkNum.textContent = repository.forkCount;

  forkCount.append(forkImg, forkNum);
  // End of fork count

  const repoDetails = document.createElement('div');
  repoDetails.classList.add('repository__details');

  if (repository.primaryLanguage) {
    repoDetails.appendChild(language);
  }

  if (repository.stargazerCount) {
    repoDetails.appendChild(starCount);
  }

  if (repository.forkCount) {
    repoDetails.appendChild(forkCount);
  }
  repoDetails.appendChild(updated);

  const div = document.createElement('div');
  div.append(link, description);
  if (topics) {
    div.append(topics);
  }
  div.append(repoDetails);

  const btn = document.createElement('btn');
  btn.classList.add('repository__btn');
  btn.innerHTML = `<img src="./images/star.svg" alt=""> Star`;

  const repositoryContainer = document.createElement('li');
  repositoryContainer.classList.add('repository');
  repositoryContainer.append(div, btn);

  return repositoryContainer
};

const populateDOM = (data) => {
  const profileImage = document.querySelector('.profile-img');
  profileImage.setAttribute('src', data.avatarUrl);
  profileImage.setAttribute('alt', `${data.name} profile image`);

  const avatarImage = document.querySelector('.avatar__image');
  avatarImage.setAttribute('src', data.avatarUrl);
  avatarImage.setAttribute('alt', `${data.name} profile image`);

  const avatarImageLarge = document.querySelector('.user__profile img');
  avatarImageLarge.setAttribute('src', data.avatarUrl);
  avatarImageLarge.setAttribute('alt', `${data.name} profile image`);

  const avatarName = document.querySelector('.avatar__name');
  const userName = document.querySelector('.user__name');
  avatarName.textContent = data.login;
  userName.textContent = data.name;

  const userImg = document.querySelector('.user-img')
  const status = document.querySelector('.status');
  if (data.status) {
    status.innerHTML = data.status.emojiHTML;
  } else {
    status.innerHTML = '<i class="fa fa-smile-o"></i>';
  }

  userImg.appendChild(status);

  const userAccount = document.querySelector('.user__account');
  userAccount.textContent = data.login;

  const userBio = document.querySelector('.user__bio');
  userBio.textContent = data.bio;

  const repoCount = document.querySelector('#repo-count');
  repoCount.textContent = data.repositories.totalCount;

  const repositories = data.repositories.edges;

  const fragment = document.createDocumentFragment();
  repositories.forEach(({ node }) => {
    fragment.appendChild(createRepository(node));
  });

  const repositoriesContainer = document.querySelector('.repositories');
  repositoriesContainer.append(fragment);

  loader.style.display = 'none';
};

loader.style.display = 'flex';

const username = prompt('Enter github username');

const githubData = {
  token: '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',
  username,
};

const body = {
  query: `
  query { 
    user(login: "${githubData.username}") {
      databaseId
      id 
      bio
      avatarUrl
      name
      login
      status {
        emoji
        emojiHTML
      }
      repositories(privacy:PUBLIC first: 20 orderBy: { field: PUSHED_AT, direction: DESC }) {
        totalCount
        edges {
          node {
            id
            name
            pushedAt
            forkCount
            resourcePath
            description
            stargazerCount
            repositoryTopics (first: 5){
              edges {
                node {
                  url
                  topic {
                    name
                  }
                }
              }
            }
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
  `,
};

const fetchData = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `bearer ${githubData.token}`,
  },
  body: JSON.stringify(body),
  method: 'POST',
};

fetch('https://api.github.com/graphql', fetchData)
  .then((res) => res.json())
  .then(({ data: { user } }) => {
    if (user) {
      populateDOM(user);
    } else {
      throw({ status: 101, message: 'User does not exist' });
    }
  })
  .catch((err) => {
    document.querySelector('.error').style.display = 'block';
    const errorMessage = document.querySelector('.error__text');
    if (err.status === 101) {
      errorMessage.textContent = err.message;
    } else {
      errorMessage.textContent = 'Something went wrong, please try again';
    }
    const loaderImg = document.querySelector('.loader__img');
    loaderImg.style.display = 'none';
  });


const handleScroll = () => {
  const image = document.querySelector('.user__profile img');
  const avatar = document.querySelector('.avatar');
  const mainHeader = document.querySelector('.main__header');
  const { bottom } = image.getBoundingClientRect();
  if (bottom < 5) {
    avatar.classList.add('show');
    mainHeader.style.zIndex = '2';
  } else {
    avatar.classList.remove('show');
    mainHeader.style.zIndex = '0';
  }
};


// Handle debounce for scroll event
let debounce;
window.addEventListener('scroll', () => {
  clearTimeout(debounce);
  debounce = setTimeout(handleScroll, 10);
});
