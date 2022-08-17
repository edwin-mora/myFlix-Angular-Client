import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUser();
  }

  /**
   * Get all movies from API
   * @returns array of JSON movie objects
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Get user info from API
   * @returns JSON user object
   */
  getUser(): void {
    this.fetchApiData.getUserInfo().subscribe((resp: any) => {
      this.user = resp;
      return this.user;
    });
  }

  /**
   * Opens dialog to display information from GenreComponent
   * @param name
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: { Name: name, Description: description },
      width: '350px',
    });
  }

  /**
   * Opens dialog to display information from DirectorComponent
   * @param name
   */
  openDirectorDialog(name: string, bio: string): void {
    this.dialog.open(DirectorComponent, {
      data: { Name: name, Bio: bio },
      width: '350px',
    });
  }

  /**
   * Opens dialog to display MovieDetailsComponent
   * @param title
   * @param description
   */
  openSynopsisDialog(title: any, description: any): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        title: title,
        description: description,
      },
      width: '350px',
    });
  }

  /**
   * Add movie to user's favorites list
   * Invokes ngOnInit when complete to update favorite button UI and user data
   * Displays success message in snackbar
   * @param movieID
   */
  addMovieToFavorites(movieID: string): void {
    const token = localStorage.getItem('token');
    this.fetchApiData.addToFavorites(movieID).subscribe((response: any) => {
      this.ngOnInit();
    });

    // show snackbar that favorite was added with option to view favorites
    this.snackBar
      .open(`Movie Added to Favorites`, 'View Favorites', {
        duration: 2000,
      })
      .onAction()
      .subscribe(() => {
        this.router.navigate(['profile']);
      });
  }

  /**
   * Checks whether or not movie is currently in favorites list
   * Changes favorite icon accordingly in HTML
   * @param id {string}
   * @returns true or false
   */
  isFavorite(id: string): boolean {
    return this.user.FavoriteMovies.includes(id);
  }

  /**
   * Remove movie from user's favorites list
   * Invokes ngOnInit when complete to update favorite button UI and user data
   * Displays success message in snackbar
   * @param movieID
   */
  deleteMovieFromFavorites(movieID: string): void {
    const token = localStorage.getItem('token');
    this.fetchApiData
      .deleteFromFavorites(movieID)
      .subscribe((response: any) => {
        // show snackbar that favorite was added with option to view favorites
        this.snackBar
          .open('Movie Removed from Favorites', 'Undo', {
            duration: 2000,
          })
          .onAction()
          .subscribe(() => {
            this.addMovieToFavorites(movieID);
          });
        this.ngOnInit();
      });
  }
}
