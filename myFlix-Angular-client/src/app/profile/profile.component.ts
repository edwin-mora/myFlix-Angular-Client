import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  Username = localStorage.getItem('user');
  favMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  /**
   * Gets user data from api call and sets the user variable to returned JSON file
   * @returns object holding user information
   * @function getUser
   */
  getUser(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiData.getUser(user).subscribe((res: any) => {
        this.user = res;
        console.log(this.user);
        return this.user;
      });
    }
  }

  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiData.getUser(user).subscribe((res: any) => {
        this.favMovies = res.FavoriteMovies;
        console.log(this.favMovies);
        return this.favMovies;
      });
    }
  }

  removeFavoriteMovies(movieID: string, title: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieID).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        'OK',
        {
          duration: 2000,
        }
      );
      this.ngOnInit();
    });
  }

  /**
   * opens the edit profile dialog from EditProfileComponent to allow user to edit their details
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
   * deletes the user profile, redirects to welcome screen
   * @function deleteUser
   */
  deleteProfile(): void {
    if (
      confirm(
        'Are you sure you want to delete your account? This cannnot be undone.'
      )
    ) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account!',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}
