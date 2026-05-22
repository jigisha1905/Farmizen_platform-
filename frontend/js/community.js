// COMMUNITY FORUM JAVASCRIPT

// Sample Posts Data
let allPosts = [
  {
    id: 1,
    author: 'Rajesh Kumar',
    category: 'agriculture',
    title: 'Best practices for organic farming',
    content: 'I have been farming organically for 5 years. Here are some tips that really worked for me: proper soil management, crop rotation, and natural pest control. Would love to hear from others!',
    avatar: 'R',
    timestamp: '2 hours ago',
    likes: 45,
    comments: [
      { author: 'Priya Singh', text: 'Great tips! I use similar methods on my farm.', time: '1 hour ago' },
      { author: 'Amit Patel', text: 'How often do you rotate crops?', time: '30 mins ago' }
    ]
  },
  {
    id: 2,
    author: 'Meera Joshi',
    category: 'gardening',
    title: 'My Kitchen Garden Success Story',
    content: 'Started my kitchen garden 3 months ago in a small balcony. Now I\'m harvesting tomatoes, spinach, and herbs daily. It\'s been an amazing journey!',
    avatar: 'M',
    timestamp: '4 hours ago',
    likes: 82,
    comments: [
      { author: 'Vikram Singh', text: 'This is inspiring! Can you share your setup?', time: '3 hours ago' }
    ]
  },
  {
    id: 3,
    author: 'Vikram Singh',
    category: 'questions',
    title: 'How to prevent pest attacks without chemicals?',
    content: 'I\'m facing pest issues on my crops. What organic methods would you recommend? I\'d prefer natural solutions.',
    avatar: 'V',
    timestamp: '6 hours ago',
    likes: 34,
    comments: []
  },
  {
    id: 4,
    author: 'Anjali Verma',
    category: 'tips',
    title: 'Composting Tips for Beginners',
    content: 'Creating compost at home is easier than you think! Start with kitchen waste, add garden materials, and let nature do the work. Here are my favorite tips for success...',
    avatar: 'A',
    timestamp: '8 hours ago',
    likes: 67,
    comments: [
      { author: 'Rajesh Kumar', text: 'How long does it take to get ready compost?', time: '7 hours ago' }
    ]
  },
  {
    id: 5,
    author: 'Neha Sharma',
    category: 'success',
    title: 'From hobby to profitable farm business',
    content: 'I turned my hobby farm into a successful business. It took planning, dedication, and support from this amazing community. Thank you all!',
    avatar: 'N',
    timestamp: '10 hours ago',
    likes: 124,
    comments: [
      { author: 'Meera Joshi', text: 'Congratulations! This is amazing!', time: '9 hours ago' },
      { author: 'Priya Singh', text: 'Can you share your business plan?', time: '8 hours ago' }
    ]
  }
];

// Current Filter
let currentFilter = 'all';

// Initialize Posts on Page Load
document.addEventListener('DOMContentLoaded', function() {
  displayPosts(allPosts);
  setupCreatePostForm();
});

// DISPLAY POSTS FUNCTION
function displayPosts(posts) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';

  if (posts.length === 0) {
    container.innerHTML = '<div class="alert alert-info text-center">No posts found. Be the first to post!</div>';
    return;
  }

  posts.forEach(post => {
    const postHTML = `
      <div class="post-card" data-category="${post.category}">
        
        <!-- POST HEADER -->
        <div class="post-header">
          <div class="post-author">
            <div class="post-avatar">${post.avatar}</div>
            <div class="post-meta">
              <div class="post-author-name">${post.author}</div>
              <div class="post-timestamp">${post.timestamp}</div>
            </div>
          </div>
          <div class="post-category-badge">${getCategoryLabel(post.category)}</div>
          <div class="post-menu">⋮</div>
        </div>

        <!-- POST BODY -->
        <div class="post-body">
          <div class="post-title">${post.title}</div>
          <div class="post-content">${post.content}</div>
        </div>

        <!-- POST FOOTER -->
        <div class="post-footer">
          <div class="post-action like-btn" onclick="likePost(this, ${post.id})">
            <span>👍</span>
            <span>${post.likes}</span>
          </div>
          <div class="post-action comment-btn" onclick="toggleComments(this, ${post.id})">
            <span>💬</span>
            <span>${post.comments.length}</span>
          </div>
          <div class="post-action share-btn">
            <span>↗️</span>
            <span>Share</span>
          </div>
        </div>

        <!-- COMMENTS SECTION -->
        <div class="comments-section" id="comments-${post.id}">
          <div class="comments-list">
            ${post.comments.map(comment => `
              <div class="comment-item">
                <div class="comment-avatar">${comment.author.charAt(0)}</div>
                <div class="comment-body">
                  <div class="comment-author">${comment.author}</div>
                  <div class="comment-text">${comment.text}</div>
                  <div class="comment-time">${comment.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="comment-input-box">
            <input type="text" placeholder="Write a comment..." id="comment-input-${post.id}">
            <button onclick="addComment(${post.id})">Post</button>
          </div>
        </div>

      </div>
    `;
    container.innerHTML += postHTML;
  });
}

// FILTER POSTS BY CATEGORY
function filterPosts(category) {
  currentFilter = category;

  // Update active tab
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Filter and display
  if (category === 'all') {
    displayPosts(allPosts);
  } else {
    const filtered = allPosts.filter(post => post.category === category);
    displayPosts(filtered);
  }
}

// GET CATEGORY LABEL
function getCategoryLabel(category) {
  const labels = {
    'agriculture': '🌾 Agriculture',
    'gardening': '🌱 Gardening',
    'success': '⭐ Success',
    'questions': '❓ Questions',
    'tips': '💡 Tips'
  };
  return labels[category] || category;
}

// TOGGLE COMMENTS
function toggleComments(btn, postId) {
  const commentsSection = document.getElementById(`comments-${postId}`);
  commentsSection.classList.toggle('show');
  btn.style.color = commentsSection.classList.contains('show') ? '#1aa34a' : '#999';
}

// LIKE POST
function likePost(btn, postId) {
  const post = allPosts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    btn.querySelector('span:last-child').textContent = post.likes;
    btn.style.color = '#1aa34a';
  }
}

// ADD COMMENT
function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const commentText = input.value.trim();

  if (commentText === '') {
    alert('Please write a comment!');
    return;
  }

  const post = allPosts.find(p => p.id === postId);
  if (post) {
    post.comments.push({
      author: 'You',
      text: commentText,
      time: 'just now'
    });

    input.value = '';
    displayPosts(currentFilter === 'all' ? allPosts : allPosts.filter(p => p.category === currentFilter));
    
    // Re-open comments section
    const commentsSection = document.getElementById(`comments-${postId}`);
    setTimeout(() => {
      commentsSection.classList.add('show');
    }, 100);
  }
}

// SETUP CREATE POST FORM
function setupCreatePostForm() {
  const form = document.getElementById('createPostForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const userName = document.getElementById('userName').value.trim();
    const postTitle = document.getElementById('postTitle').value.trim();
    const postCategory = document.getElementById('postCategory').value;
    const postDescription = document.getElementById('postDescription').value.trim();

    // Validation
    if (!userName || !postTitle || !postCategory || !postDescription) {
      alert('Please fill all required fields!');
      return;
    }

    // Create new post
    const newPost = {
      id: allPosts.length + 1,
      author: userName,
      category: postCategory,
      title: postTitle,
      content: postDescription,
      avatar: userName.charAt(0).toUpperCase(),
      timestamp: 'just now',
      likes: 0,
      comments: []
    };

    // Add to beginning of posts array
    allPosts.unshift(newPost);

    // Clear form
    form.reset();

    // Reset filter to show all posts
    currentFilter = 'all';
    document.querySelectorAll('.cat-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector('.cat-tab').classList.add('active');

    // Display updated posts
    displayPosts(allPosts);

    // Show success message
    alert('Post created successfully! 🎉');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ADD NEW POST MANUALLY (for testing)
function addNewPost(author, title, category, content) {
  const newPost = {
    id: allPosts.length + 1,
    author: author,
    category: category,
    title: title,
    content: content,
    avatar: author.charAt(0).toUpperCase(),
    timestamp: 'just now',
    likes: 0,
    comments: []
  };
  allPosts.unshift(newPost);
  displayPosts(allPosts);
}

// SEARCH POSTS (for future feature)
function searchPosts(searchTerm) {
  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayPosts(filtered);
}

// EXPORT FOR TESTING
window.community = {
  addNewPost: addNewPost,
  searchPosts: searchPosts,
  filterPosts: filterPosts,
  likePost: likePost,
  addComment: addComment
};