  
import { Component, OnInit,Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FormBuilder , FormGroup , Validators} from '@angular/forms';
import { Comment } from '../shared/comment';
@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
  
})
export class DishDetailComponent implements OnInit {
  visibility = 'shown';
  dish:Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  formErrors = {
    author: '' ,
    rating: 5 ,
    comment: ''
  };
  validationMessages = {
    'author': {
      'required': 'Author is required.' ,
      'minlength': 'Author must be at least 2 characters long.'
    } ,
    'comment': {
      'required': 'comment is required.' ,
      'minlength': 'comment must be at least 2 characters long.'
    } ,
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public baseURL: any) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {
       this.visibility = 'hidden'; 
       return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; 
      this.dishcopy = dish; 
      this.setPrevNext(dish.id); 
      this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack() {
    this.location.back();
  }
  private createForm(): void {
    this.commentForm = this.fb.group({
      author: ['' , [Validators.required , Validators.minLength(2)]] ,
      rating: 5 ,
      comment: ['' , [Validators.required , Validators.minLength(2)]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    // this.dish.comments.push(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    this.commentForm.reset({
      author: '' ,
      rating: 5 ,
      comment: ''
    });
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}


