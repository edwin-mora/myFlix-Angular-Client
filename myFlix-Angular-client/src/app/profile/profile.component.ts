import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  Username = localStorage.getItem('user');
  favMovies: any[] = [];

  constructor(
    public dialog: MatDialog,
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  /**
   * call API endpoint to get user info
   * @function getUserProfile
   * @param Username
   * @return users data in json format
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

  /**
   * get users FavoriteMovies from the users data
   */
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

  /**
   * use API end-point to remove user favorite
   * @function deleteFavoriteMovies
   * @param Id {string}
   * @returns updated users data in json format
   */
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
   * call API endpoint to remove the current user
   * @function deleteUserProfile
   * @param Username {any}
   * @return that the account has been removed
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

  /**
   * open a dialog to edit the profile of the user
   * @module EditProfileFormComponent
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
   *open a dialog to display the GenreViewComponent
   * @param name {string}
   * @param description {string}
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: { name: name, description: description },
      width: '300px',
    });
  }

  /**
   * open a dialog to display the DirectorViewComponent
   * @param name {string}
   * @param bio {string}
   * @param birthdate {string}
   */

  openDirectorDialog(name: string, bio: string, birthdate: string): void {
    this.dialog.open(DirectorComponent, {
      data: { name: name, bio: bio, birth: birthdate },
      width: '300px',
    });
  }

  /**
   * open a dialog to display the MovieDescriptionComponent
   * @param title {string}
   * @param description {string}
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: { title: title, description: description },
      width: '300px',
    });
  }
}

// #############################################
