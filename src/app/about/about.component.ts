import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { LEADERS } from '../shared/leaders';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders : Leader[];
  
  constructor(private leaderservice: LeaderService) { }


  ngOnInit(): void {
    // this.leaders = this.leaderservice.getLeaders();
    this.leaderservice.getLeaders().then(leaders => this.leaders = leaders);
    console.log(this.leaders);
   
  }

}

