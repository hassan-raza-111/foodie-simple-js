/* ========================================
   Reviews Module - Carousel logic
   ======================================== */

const reviewsData = [
  {
    name: 'Ali Ahmed',
    initials: 'AA',
    location: 'Lahore',
    stars: 5,
    text: 'Absolutely love the food quality! The biryani was authentic and the delivery was super fast. Definitely ordering again. Best food delivery service in the city!'
  },
  {
    name: 'Fatima Khan',
    initials: 'FK',
    location: 'Karachi',
    stars: 5,
    text: 'The pizza was fresh and delicious, just like from an Italian restaurant. The app is so easy to use and the prices are very reasonable. Highly recommended!'
  },
  {
    name: 'Usman Malik',
    initials: 'UM',
    location: 'Islamabad',
    stars: 4,
    text: 'Great variety of food options and excellent customer service. The delivery was on time and the food was still hot. Will be ordering regularly from now on.'
  },
  {
    name: 'Ayesha Siddiqui',
    initials: 'AS',
    location: 'Rawalpindi',
    stars: 5,
    text: 'I ordered the shawarma and cold coffee combo - it was amazing! The portion sizes are generous and everything tasted fresh. Five stars from me!'
  }
];

let currentSlide = 0;
let autoPlayInterval = null;

document.addEventListener('DOMContentLoaded', function () {
  const carouselTrack = document.querySelector('.carousel-track');
  if (!carouselTrack) return;

  renderReviews();
  startAutoPlay();
});

function renderReviews() {
  const track = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track) return;

  track.innerHTML = reviewsData.map((review, i) => `
    <div class="carousel-slide ${i === 0 ? 'active' : ''}">
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>
        <p class="review-text">"${review.text}"</p>
        <div class="review-author">
          <div class="review-avatar">${review.initials}</div>
          <div class="review-author-info">
            <h4>${review.name}</h4>
            <p>${review.location}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = reviewsData.map((_, i) => `
      <button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>
    `).join('');
  }
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentSlide = index;
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  resetAutoPlay();
}

function nextSlide() {
  goToSlide((currentSlide + 1) % reviewsData.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + reviewsData.length) % reviewsData.length);
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}
