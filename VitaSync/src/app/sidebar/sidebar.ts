import { CommonModule } from '@angular/common';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true
})
export class Sidebar {
  @Input() sidebarOpen = true;
  @Output() sidebarOpenChange = new EventEmitter<boolean>();

  closeSidebar() {
    this.sidebarOpenChange.emit(false); 
  }
}
