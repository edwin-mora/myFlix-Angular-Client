import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Get user information from API
   * @returns user (set from JSON user object)
   */
  getUser(): void {
    this.fetchApiData.getUserInfo().subscribe((resp: any) => {
      this.user = resp;
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        this.favoriteMovies = this.movies.filter((movie: any) =>
          this.user.FavoriteMovies.includes(movie._id)
        );
        console.log(this.favoriteMovies);
        return this.favoriteMovies;
      });
      return this.user;
    });
  }

  /**
   * Opens dialog to edit user information
   * @param user {object}
   */
  openEditProfileDialog(user: any): void {
    this.dialog.open(EditProfileComponent, {
      width: '400px',
    });
  }

  /**
   * Remove movie from user's favorites list
   * @param movieID
   * @returns favorite movies list
   */
  deleteMovieFromFavorites(movieID: string): void {
    const token = localStorage.getItem('token');
    this.fetchApiData
      .deleteFromFavorites(movieID)
      .subscribe((response: any) => {
        this.snackBar.open('Movie removed from favorites.', 'OK', {
          duration: 1000,
        });
        this.ngOnInit();
        return this.favoriteMovies;
      });
  }

  /**
   * Delete current user
   * Deletes user via deleteUser function
   * Clears local storage of user and token information
   * Redirects to welcome screen
   */
  deleteUser(): void {
    if (confirm('Are you sure? This action cannot be undone.')) {
      this.fetchApiData.deleteUser().subscribe(() => {
        localStorage.clear();
      });
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open('User deleted', 'OK', {
          duration: 2000,
        });
      });
    }
  }
}
