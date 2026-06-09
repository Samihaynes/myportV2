// ─────────────────────────────────────────────────────────────────── TYPEWRITER EFFECT
const phrases = [
  'Desarrollador Web Full-Stack',
  'Técnico de Automoción',
  'Apasionado por el código',
  'Solucionador de problemas'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typewriterElement = document.getElementById('tw');

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typewriterElement.textContent = currentPhrase.slice(0, ++charIndex);

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }

    setTimeout(typeWriter, 60);
  } else {
    typewriterElement.textContent = currentPhrase.slice(0, --charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeWriter, 300);
      return;
    }

    setTimeout(typeWriter, 30);
  }
}

typeWriter();

// ─────────────────────────────────────────────────────────────────── SCROLL REVEAL
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        // Animate language bars on reveal
        const languageBar = entry.target.querySelector('.lang-fill[data-w]');
        if (languageBar) {
          setTimeout(() => {
            languageBar.style.width = languageBar.dataset.w + '%';
          }, 150);
        }
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.rv, .rv2').forEach((element) => {
  scrollObserver.observe(element);
});

// ─────────────────────────────────────────────────────────────────── CONTACT FORM
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-send');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Enviando...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://formspree.io/f/xjgdrwlz', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success message
        document.getElementById('ffields').style.display = 'none';
        document.getElementById('ok').style.display = 'block';

        // Reset after 4 seconds
        setTimeout(() => {
          document.getElementById('ffields').style.display = 'block';
          document.getElementById('ok').style.display = 'none';
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      alert('Error: ' + error.message + '. Por favor, intenta de nuevo.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ─────────────────────────────────────────────────────────────────── TODO LIST MANAGEMENT
class TodoList {
  constructor(storageKey = 'portfolio-todos') {
    this.storageKey = storageKey;
    this.todos = this.loadTodos();
  }

  /* Save todos to localStorage */
  saveTodos() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  /* Load todos from localStorage */
  loadTodos() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /* Add a new todo */
  addTodo(title) {
    const todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    this.saveTodos();
    return todo;
  }

  /* Mark todo as complete/incomplete */
  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }

    return todo;
  }

  /* Delete a todo */
  deleteTodo(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveTodos();
  }

  /* Get all todos */
  getAllTodos() {
    return this.todos;
  }

  /* Get completed todos */
  getCompletedTodos() {
    return this.todos.filter((t) => t.completed);
  }

  /* Get pending todos */
  getPendingTodos() {
    return this.todos.filter((t) => !t.completed);
  }

  /* Clear all todos */
  clearAll() {
    this.todos = [];
    this.saveTodos();
  }
}

// Initialize TodoList instance globally
window.todoManager = new TodoList();

/**
 * Usage examples in console:
 *
 * todoManager.addTodo('Revisar portafolio')
 * todoManager.getAllTodos()
 * todoManager.toggleTodo(id)
 * todoManager.deleteTodo(id)
 * todoManager.getPendingTodos()
 * todoManager.getCompletedTodos()
 * todoManager.clearAll()
 */

// ─────────────────────────────────────────────────────────────────── UTILITY: Hide elements on mobile
function hideOnMobile(selector) {
  const element = document.querySelector(selector);
  if (element) {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => {
      element.style.display = e.matches ? 'none' : 'block';
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    handleMediaChange(mediaQuery);
  }
}

// ─────────────────────────────────────────────────────────────────── SMOOTH SCROLL FALLBACK
if (!CSS.supports('scroll-behavior', 'smooth')) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
