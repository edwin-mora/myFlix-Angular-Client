import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { Router } from '@angular/router';

import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public MatDialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getFavoriteMovies();
  }
  /**
   * Gets user data
   * @returns object holding user info
   * @function getUser
   */
  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      return this.user;
    });
  }
  /**
   * opens the edit profile dialog to allow user to edit their details
   */
  openEditProfileDialog(): void {
    this.MatDialog.open(EditProfileComponent, {
      width: '300px',
    });
  }

  /**
   * delete the user profile
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
  /**
   * Gets user's favorite movies data
   * @function getAllMovies
   * @function getFavouriteMovies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.user.FavoriteMovies);
      this.movies.forEach((movie: any) => {
        this.fetchApiData.getFavoriteMovies().subscribe((result: any) => {
          if (result.includes(movie._id)) {
            this.favoriteMovies.push(movie);
          }
        });
      });
    });
  }

  /**
   * opens the movie's director info dialog
   */
  openDirectorDialog(name: string, bio: string, birthday: Date): void {
    this.MatDialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday,
      },
      // Assign dialog width
      width: '500px',
    });
  }
  /**
   * opens the movie's genre info dialog
   */
  openGenreDialog(name: string, description: string): void {
    this.MatDialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }
  /**
   * opens the movie details dialog
   */
  openSynopsisDialog(title: string, description: string): void {
    this.MatDialog.open(SynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }
  /**
   * Remove movie from user's favourite list
   * @function deleteFavouriteMovies
   */
  removeFromFavoriteMovies(id: string, title: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      this.snackBar.open(
        `Successfully removed ${title} from favorite movies.`,
        'OK',
        {
          duration: 4000,
          verticalPosition: 'top',
        }
      );
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    });
  }
}
