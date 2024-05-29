async function fetchGitHubData(username) {
  if (!username) {
    alert('O campo de usuário do GitHub não pode estar vazio.');
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    alert(`Falha ao buscar dados: ${error.message}`);
    return null;
  }
}

function createBarChart(repos) {
  const ctx = document.getElementById('barChart').getContext('2d');
  const labels = repos.map(repo => repo.name);
  const stars = repos.map(repo => repo.stargazers_count);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stars Count',
        data: stars,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function createPieChart(repos) {
  const ctx = document.getElementById('pieChart').getContext('2d');
  const languages = {};
  repos.forEach(repo => {
    if (repo.language in languages) {
      languages[repo.language]++;
    } 
    else {
      languages[repo.language] = 1;
    }
  });
  const labels = Object.keys(languages);
  const data = Object.values(languages);

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'black'
          }
        }
      }
    }
  });
}

async function renderCharts(username) {
  const repos = await fetchGitHubData(username);
  if (repos) {
    const barChart = createBarChart(repos);
    const pieChart = createPieChart(repos);
  }
}

document.getElementById('githubForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('githubUsername').value.trim();
  if (username === "") {
    alert('O campo de usuário do GitHub não pode estar vazio.');
  } 
  else {
    renderCharts(username);
  }
});
