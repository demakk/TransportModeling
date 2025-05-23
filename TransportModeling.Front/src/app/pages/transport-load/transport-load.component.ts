import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AUTH_ENDPOINTS } from '../../config/constants';
import { FooterComponent } from '../../components/footer/footer.component';
import { ToastService } from '../../services/toast.service';
import { RouteShortDto } from '../../models/routes.model';

Chart.register(...registerables);

interface BusInQueue {
  capacity: number;
}

interface StopLoad {
  orderInRoute: number;
  stopName: string;
  totalPassengers: number;
  availableCapacity: number;
  loadPercentage: number;
}

interface ModelingResult {
  routeName: string;
  intervalMinutes: number;
  stopsLoad: StopLoad[];
}

@Component({
  selector: 'app-transport-load',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './transport-load.component.html',
  styleUrls: ['./transport-load.component.scss']
})
export class TransportLoadComponent {
  role: string | null = null;
  intervalText: string = '';

  routes: RouteShortDto[] = [];
  isLoadingRoutes: boolean = false;

canAccess(): boolean {
  return this.role === 'user' || this.role === 'admin';
}

  constructor(private http: HttpClient, private authService: AuthService, private toast: ToastService) {
    this.role = this.authService.getUserRole();
  }

  selectedPeriod: string = 'MorningPeak';
  routeName: string = 'А41';

  periods = [
    { value: 'MorningPeak', label: 'Ранковий пік (2 год)' },
    { value: 'midday', label: 'Міжпік (2 год)' },
    { value: 'evening_peak', label: 'Вечірній пік (2 год)' },
    { value: 'early_morning', label: 'Ранній ранок (1 год)' },
    { value: 'late_evening', label: 'Пізній вечір (1 год)' },
  ];

  vehicleTypes = [
    { id: 'small', name: 'Малий автобус', capacity: 30 },
    { id: 'medium', name: 'Середній автобус', capacity: 50 },
    { id: 'large', name: 'Великий автобус', capacity: 80 },
  ];

  newVehicleType: string = this.vehicleTypes[0].id;
  vehicleQueue: number[] = [];

  chart: Chart | null = null;

  ngOnInit(): void {
    this.loadRoutes();
  }
  loadRoutes() {
    this.isLoadingRoutes = true;
    this.http.get<RouteShortDto[]>(AUTH_ENDPOINTS.getRoutes).subscribe({
      next: res => {
        this.routes = res;
        this.isLoadingRoutes = false;
  
        // Якщо активний маршрут ще не встановлено — обираємо перший
        if (!this.routeName && res.length > 0) {
          this.routeName = res[0].name;
        }
      }
    });
  }

  readonly STORAGE_KEY = 'transport_config';

  addVehicleToQueue() {
    const selected = this.vehicleTypes.find(v => v.id === this.newVehicleType);
    if (selected) {
      this.vehicleQueue.push(selected.capacity);
    }
  }

  removeFromQueue(index: number) {
    this.vehicleQueue.splice(index, 1);
  }

  buildGraph() {
    if (this.vehicleQueue.length === 0) {
      this.toast.show('Додайте хоча б один автобус у чергу!');
      return;
    }

    const payload = {
      routeName: this.routeName,
      periodCode: this.selectedPeriod,
      busQueue: this.vehicleQueue.map(cap => ({ capacity: cap }))
    };

    this.http.post<ModelingResult>(AUTH_ENDPOINTS.buildGraph, payload).subscribe({
      next: (result) => this.renderGraph(result)
    });
  }

  renderGraph(result: ModelingResult) {
    const container = document.querySelector('#chartContainer');
    if (!container) return;
  
    container.innerHTML = '';
  
    // Створюємо scrollable wrapper
    const scrollWrap = document.createElement('div');
    scrollWrap.style.overflowX = 'auto';
    scrollWrap.style.width = '100%';
    scrollWrap.style.padding = '0';
    scrollWrap.style.margin = '0';
  
    // Створюємо canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'loadChart';
  
    // ❗ canvas має style.width = 75vw, а внутрішню ширину в px
    canvas.style.width = '75vw';
    canvas.width = window.innerWidth * 0.75;
    canvas.height = 300;
  
    scrollWrap.appendChild(canvas);
    container.appendChild(scrollWrap);
  
    // Дані
    const labels = result.stopsLoad.map(s => `${s.orderInRoute}. ${s.stopName}`);
    const data = result.stopsLoad.map(s => Math.round(s.loadPercentage));
    const colors = data.map(p =>
      p < 70 ? '#10B981' :        // зелений
      p < 90 ? '#FACC15' :        // жовтий
      p < 110 ? '#EF4444' :       // червоний
               '#B91C1C'          // темно-червоний
    );
  
    this.intervalText = `Інтервал між відправленнями: ${result.intervalMinutes.toFixed(1)} хв`;
    
    // Побудова графіка
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Завантаження (%)',
          data,
          backgroundColor: colors,
        }]
      },
      options: {
        responsive: false, // ми контролюємо розмір самі
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 150,
            title: {
              display: true,
              text: '% від загальної місткості'
            }
          },
          x: {
            ticks: {
              font: { size: 10 },
              maxRotation: 30,
              minRotation: 30
            }
          }
        }
      }
    });
  }
  

  saveUserSettings() {
    const config = {
      routeName: this.routeName,
      selectedPeriod: this.selectedPeriod,
      vehicleQueue: this.vehicleQueue
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }
  

  loadUserSettings() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        this.routeName = config.routeName || '';
        this.selectedPeriod = config.selectedPeriod || '';
        this.vehicleQueue = config.vehicleQueue || [];
      } catch (err) {
        console.warn('❌ Не вдалося завантажити конфігурацію користувача:', err);
      }
    }
  }
  



}
