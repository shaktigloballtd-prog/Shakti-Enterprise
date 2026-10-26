import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Header } from './components/header';
import { Sidebar, NavTab } from './components/sidebar';
import { DashboardView } from './components/dashboard-view';
import { StorefrontView } from './components/storefront-view';
import { ProductsView } from './components/products-view';
import { OrdersView } from './components/orders-view';
import { DropshipView } from './components/dropship-view';
import { AffiliateView } from './components/affiliate-view';
import { ErpView } from './components/erp-view';
import { PosView } from './components/pos-view';
import { FreeToolsView } from './components/free-tools-view';
import { MarketView } from './components/market-view';
import { AuthView } from './components/auth-view';
import { StudioView } from './components/studio-view';
import { CalendarView } from './components/calendar-view';
import { AgentsView } from './components/agents-view';
import { AnalyticsView } from './components/analytics-view';
import { ManagerView } from './components/manager-view';
import { SecurityView } from './components/security-view';
import { Toast } from './components/toast';
import { Product } from './models/shakti.models';
import { ShaktiApi } from './services/shakti';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Header,
    Sidebar,
    DashboardView,
    StorefrontView,
    ProductsView,
    OrdersView,
    DropshipView,
    AffiliateView,
    ErpView,
    PosView,
    FreeToolsView,
    MarketView,
    AuthView,
    StudioView,
    CalendarView,
    AgentsView,
    AnalyticsView,
    ManagerView,
    SecurityView,
    Toast,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly api = inject(ShaktiApi);
  readonly activeWorkspaceMode = signal<'storefront' | 'hq'>('storefront');
  readonly currentTab = signal<NavTab>('dashboard');
  readonly mobileMenuOpen = signal<boolean>(false);
  readonly selectedProductForPromotion = signal<Product | null>(null);

  setWorkspaceMode(mode: 'storefront' | 'hq') {
    this.activeWorkspaceMode.set(mode);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setTab(tab: NavTab) {
    this.currentTab.set(tab);
    this.mobileMenuOpen.set(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
  }

  handlePromoteProduct(product: Product) {
    this.selectedProductForPromotion.set(product);
    this.setWorkspaceMode('hq');
    this.setTab('studio');
  }
}
