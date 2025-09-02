import AOS from 'aos';
import Swal from 'sweetalert2';
import 'aos/dist/aos.css';
import './styles/style.css';
import './script/components/index.js';
import home from './script/view/home.js';

window.Swal = Swal;
window.AOS = AOS;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      offset: 100,
    });

    await home();
    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);

    Swal.fire({
      icon: 'error',
      title: 'Application Failed to Load',
      text: 'Something went wrong while initializing the app.',
      confirmButtonText: 'Reload Page',
      confirmButtonColor: '#3498db',
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  }
});
