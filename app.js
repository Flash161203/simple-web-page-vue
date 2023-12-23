let app = Vue.createApp({
  data: function () {
    return {
      currentPage: 1,
      lastPage: null,
      apiBaseUrl: "https://cryptodire.kontinentalist.com/api/v1/stories",
      isAllStoriesLoaded: false,
    };
  },

  methods: {
    // Load the stories from the given API URL
    async getStories(apiUrl) {
      try {
        // Make a GET request
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse JSON response
        const data = await response.json();

        this.lastPage = data.last_page;

        const storyList = data.data;
        const stories = [];

        for (var i = 0; i < storyList.length; i++) {
          var story = storyList[i];

          stories.push({
            title: story.title,
            image: story.hero_image.url,
            snippet: story.dek,
          });
        }

        this.currentPage++;

        return stories;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // Function to render the stories
    renderStories(storyList) {
      var storiesContainer = document.getElementById("stories-container");

      // Loop through stories array and create story elements
      for (var i = 0; i < storyList.length; i++) {
        var story = storyList[i];

        // Create story element
        var storyElement = document.createElement("div");
        storyElement.classList.add("story");

        // Create story image element
        var storyImageElement = document.createElement("img");
        storyImageElement.classList.add("story-image");
        storyImageElement.src = story.image;
        storyElement.appendChild(storyImageElement);

        // Create story content element
        var storyContentElement = document.createElement("div");
        storyContentElement.classList.add("story-content");

        // Create story title element
        var storyTitleElement = document.createElement("h2");
        storyTitleElement.classList.add("story-title");
        storyTitleElement.textContent = story.title;
        storyContentElement.appendChild(storyTitleElement);

        // Create story snippet element
        var storySnippetElement = document.createElement("p");
        storySnippetElement.classList.add("story-snippet");
        storySnippetElement.innerHTML = story.snippet;
        storyContentElement.appendChild(storySnippetElement);

        // Append story content element to story element
        storyElement.appendChild(storyContentElement);

        // Append story element to stories container
        storiesContainer.appendChild(storyElement);
      }
    },

    // Function to load the initial set of stories
    async initialLoad() {
      const stories = await this.getStories(this.apiBaseUrl);
      this.renderStories(stories);
    },

    // Function to load more stories
    async loadStories() {
      const stories = await this.getStories(
        `${this.apiBaseUrl}?page=${this.currentPage}`
      );
      this.renderStories(stories);

      if (this.currentPage > this.lastPage) {
        this.isAllStoriesLoaded = true;
      }
    },
  },

  mounted() {
    this.initialLoad();
  },
});

app.mount("#app");
