// economic-modeling.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AUTH_ENDPOINTS } from '../../config/constants';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { FooterComponent } from '../../components/footer/footer.component';
import { ToastService } from '../../services/toast.service';
import { RouteShortDto } from '../../models/routes.model';

Chart.register(...registerables);

interface VehicleType {
  id: string;
  name: string;
  capacity: number;
  count: number;
}

interface StopLoadDto {
  orderInRoute: number;
  stopName: string;
  totalPassengers: number;
  availableCapacity: number;
  loadPercentage: number;
}

interface OptimalConfigItemDto {
  typeName: string;
  count: number;
  capacity: number;
}

interface OptimizeFleetOptionDto {
  optimalConfig: OptimalConfigItemDto[];
  avgLoad: number;
  maxLoad: number;
  interval: number;
  ticketPrice: number;
  stopsLoad: StopLoadDto[];
}

interface OptimizeFleetResultDto {
  routeName: string;
  period: string;
  options: OptimizeFleetOptionDto[];
}

interface RouteNormsDto {
  routeName: string;
  periodCode: string;
  maxAvgLoad: number;
  maxPeakLoad: number;
  maxIntervalMinutes: number;
}

@Component({
  selector: 'app-economic-modeling',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './economic-modeling.component.html',
  styleUrls: ['./economic-modeling.component.scss']
})
export class EconomicModelingComponent {
  routeName: string = 'А41';
  selectedPeriod: string = 'MorningPeak';
  role: string | null = null;
  private normsCache = new Map<string, RouteNormsDto>();
  routes: RouteShortDto[] = [];
  isLoadingRoutes: boolean = false;

  periods = [
    { value: 'MorningPeak', label: 'Ранковий пік (2 год)' },
    { value: 'midday', label: 'Міжпік (2 год)' },
    { value: 'evening_peak', label: 'Вечірній пік (2 год)' },
    { value: 'early_morning', label: 'Ранній ранок (1 год)' },
    { value: 'late_evening', label: 'Пізній вечір (1 год)' },
  ];

  vehicleTypes = [
    { id: 'small', name: 'Малий автобус', capacity: 30, count: 0 },
    { id: 'medium', name: 'Середній автобус', capacity: 50, count: 0 },
    { id: 'large', name: 'Великий автобус', capacity: 80, count: 0 },
  ];

  routeNorms: RouteNormsDto | null = null;
  normsError: string | null = null;

  result: OptimizeFleetResultDto | null = null;
  intervalText: string = '';
  chart: Chart | null = null;
  selectedGraphOption: OptimizeFleetOptionDto | null = null;
  

  constructor(private http: HttpClient, private authService: AuthService, private toast: ToastService) {
    this.role = this.authService.getUserRole();
  }

  canAccess(): boolean {
    return this.role === 'user' || this.role === 'admin';
  }

  loadNorms() {
  this.routeNorms = null;
  this.normsError = null;

  const params = {
    routeName: this.routeName,
    periodCode: this.selectedPeriod
  };

  this.http.get<RouteNormsDto>(AUTH_ENDPOINTS.getNormsForRoutePeriod, { params }).subscribe({
    next: res => {
      this.routeNorms = res;
    }
  });
}

routeNormsVisible: boolean = false;

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

toggleNorms() {
  if (this.routeNormsVisible) {
    this.routeNormsVisible = false;
    this.routeNorms = null;
    return;
  }

  const cacheKey = `${this.routeName}|${this.selectedPeriod}`;

  if (this.normsCache.has(cacheKey)) {
    this.routeNorms = this.normsCache.get(cacheKey)!;
    this.routeNormsVisible = true;
    return;
  }

  this.routeNorms = null;
  const params = {
    routeName: this.routeName,
    periodCode: this.selectedPeriod
  };

  this.http.get<RouteNormsDto>(AUTH_ENDPOINTS.getNormsForRoutePeriod, { params }).subscribe({
    next: res => {
      this.routeNorms = res;
      this.routeNormsVisible = true;
      this.normsCache.set(cacheKey, res);
    }
  });
}


  runOptimization() {
    const busTypes = this.vehicleTypes
      .filter(v => v.count > 0)
      .map(v => ({ capacity: v.capacity, maxCount: v.count }));

    if (busTypes.length === 0) {
      this.toast.show('Введіть кількість хоча б одного типу автобуса!');
      return;
    }

    const payload = {
      routeName: this.routeName,
      periodCode: this.selectedPeriod,
      busTypes
    };

    this.http.post<OptimizeFleetResultDto>(AUTH_ENDPOINTS.optimizeFleet, payload).subscribe({
      next: (res) => {
        this.result = res;
        this.selectedGraphOption = null;
        this.clearGraph();
      }
    });
  }

  viewGraph(option: OptimizeFleetOptionDto) {
    this.selectedGraphOption = option;
      setTimeout(() => {
    this.renderGraph(option.stopsLoad, option.interval);
  }, 0);
    this.renderGraph(option.stopsLoad, option.interval);
  }

  renderGraph(stopsLoad: StopLoadDto[], intervalMinutes: number) {
    const container = document.querySelector('#chartContainer');
    if (!container) return;
    container.innerHTML = '';

    const scrollWrap = document.createElement('div');
    scrollWrap.style.overflowX = 'auto';
    scrollWrap.style.width = '100%';

    const canvas = document.createElement('canvas');
    canvas.id = 'loadChart';
    canvas.style.width = '75vw';
    canvas.width = window.innerWidth * 0.75;
    canvas.height = 300;

    scrollWrap.appendChild(canvas);
    container.appendChild(scrollWrap);

    const labels = stopsLoad.map(s => `${s.orderInRoute}. ${s.stopName}`);
    const data = stopsLoad.map(s => Math.round(s.loadPercentage));
    const colors = data.map(p =>
      p < 70 ? '#10B981' : p < 90 ? '#FACC15' : p < 110 ? '#EF4444' : '#B91C1C');

    this.intervalText = `Інтервал між відправленнями: ${intervalMinutes.toFixed(1)} хв`;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Завантаження (%)', data, backgroundColor: colors }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 150,
            title: { display: true, text: '% від загальної місткості' }
          },
          x: {
            ticks: { font: { size: 10 }, maxRotation: 30, minRotation: 30 }
          }
        }
      }
    });
  }

  clearGraph() {
    const container = document.querySelector('#chartContainer');
    if (container) container.innerHTML = '';
    this.chart?.destroy();
    this.chart = null;
    this.intervalText = '';
  }
}
