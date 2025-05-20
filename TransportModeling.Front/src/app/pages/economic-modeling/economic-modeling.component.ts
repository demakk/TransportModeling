// economic-modeling.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AUTH_ENDPOINTS } from '../../config/constants';
import { AuthService } from '../../services/auth.service';

interface VehicleType {
  id: string;
  name: string;
  capacity: number;
  costPerKm?: number;
  count: number;
}

interface OptimizationResult {
  optimalConfig: {
    count: number;
    typeName: string;
    capacity: number;
  }[];
  avgLoad: number;
  maxLoad: number;
  interval: number;
  ticketPrice: number;
}

@Component({
  selector: 'app-economic-modeling',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './economic-modeling.component.html',
  styleUrls: ['./economic-modeling.component.scss']
})
export class EconomicModelingComponent {
  routeName: string = 'A41';
  selectedPeriod: string = 'MorningPeak';
  role: string | null = null;

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

  result: OptimizationResult | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.role = this.authService.getUserRole();
  }

  canAccess(): boolean {
    return this.role === 'user' || this.role === 'admin';
  }

  runOptimization() {
    const busQueue = this.vehicleTypes
      .filter(v => v.count > 0)
      .flatMap(v => Array(v.count).fill({ capacity: v.capacity }));

    if (busQueue.length === 0) {
      alert('Введіть кількість хоча б одного типу автобуса!');
      return;
    }

    const payload = {
      routeName: this.routeName,
      periodCode: this.selectedPeriod,
      busQueue
    };

    this.http.post<OptimizationResult>(AUTH_ENDPOINTS.buildGraph, payload).subscribe({
      next: (res) => {
        this.result = res;
      },
      error: (err) => {
        console.error('❌ Помилка оптимізації:', err);
        alert('Помилка при запиті до бекенду');
      }
    });
  }
}
