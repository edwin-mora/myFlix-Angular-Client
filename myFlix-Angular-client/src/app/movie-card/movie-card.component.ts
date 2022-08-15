import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';

import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favouriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public MatDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFavoriteMovies();
    this.getMovies();
  }
  /**
   * Gets movies from api call and sets the movies state to return JSON file
   * @returns array holding movies objects
   * @function getAllMovies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * opens the user director dialog from DirectorComponent to displaying details
   * @param name
   * @param bio
   * @param birthday
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
   * opens the user genre dialog from GenreComponent to displaying details
   * @param name
   * @param description
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
   * @param title
   * @param description
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
   * Gets favorite movies and sets the favorite movies variable
   * @returns array holding ids of user's favorite movies
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favouriteMovies = resp;
      return this.favouriteMovies;
    });
  }
  /**
   * add a movie to the list of favourite movies
   * @param id
   * @function addFavouriteMovies
   */
  addToFavoriteMovies(id: string): void {
    this.fetchApiData.addFavoriteMovies(id).subscribe((result) => {
      this.ngOnInit();
    });
  }
  /**
   * remove a movie from the list of favourite movies
   * @param id
   * @function deleteFavouriteMovies
   */
  removeFromFavoriteMovies(id: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovies(id).subscribe((result) => {
      console.log(result);
      this.ngOnInit();
    });
  }
  /**
   * checks if a movie is included in the user's list of favorite movies
   * @param id
   * @returns true, if the movie is a favorite move, else false
   */
  isFavorite(id: string): boolean {
    return this.favouriteMovies.includes(id);
  }
}
