import { Component, OnInit, Input, OnChanges, AfterViewChecked } from '@angular/core';
import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'app-contributions',
  templateUrl: './contributions.component.html',
  styleUrls: ['./contributions.component.scss']
})
export class ContributionsComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() contributions = {};
  @Input() request = {};

  chartWidth = 0;
  chartHeight = 0;
  squareSize = 12;
  margin = { top: 100, right: 0, bottom: 0, left: 100 };
  squaresGroup: d3;
  svg: d3;

  audios = [];

  readingMusic = false;

  musicSkeleton = [];
  musicTiming = [];

  ngOnInit() {
    this.chartHeight = document.body.clientHeight * 0.6 * 0.5;
    this.chartWidth = document.body.clientWidth * 0.8;

    this.squareSize = Math.round(this.chartWidth / 54) - 3;

    const wrapper = d3.select('#chart-wrapper');

    this.svg = wrapper.append('svg').attr('width', this.chartWidth).attr('height', this.chartHeight).attr('x', 0).attr('y', 0)
      .attr('id', 'github-chart');

    this.squaresGroup = this.svg.append('g').attr('transform', 'translate(' + ((this.squareSize + 3) / 2) + ', ' + ((this.chartHeight / 2) - (7 * (this.squareSize + 3)) / 2) + ')');
  }

  ngOnChanges(change) {
    if (change.contributions && change.contributions.currentValue && change.contributions.currentValue.contributions) {
      this.contributions['contributions'] = this.contributions['contributions'].filter((contribution) => {
        return this.isInRange(contribution['date']);
      });
      console.log('reconstruct', this.contributions);
      this.constructChart(this.contributions);
    }
  }

  isInRange(date) {
    return moment(date) <= moment() && moment(date) > moment().weekday(1).add(-52 * 7 - 2, 'days');
  }

  constructChart(contributions) {
    this.squaresGroup.selectAll('rect').remove();
    const squares = this.squaresGroup.selectAll('rect')
      .data(contributions['contributions'])
      .enter()
      .append('rect');

    const squaresAttributes = squares
      .attr('x', (d, i) => {
        return Math.trunc(((contributions['contributions'].length - 1) - i) / 7) * (this.squareSize + 3);
      })
      .attr('y', (d, i) => {
        return ((contributions['contributions'].length - 1 - i) % 7) * (this.squareSize + 3);
      })
      .attr('class', (d, i) => 'row-' + (contributions['contributions'].length - 1 - i) % 7 + ' column-' + Math.trunc(((contributions['contributions'].length - 1) - i) / 7))
      .attr('id', (d, i) => 'row-' + (contributions['contributions'].length - 1 - i) % 7 + '-column-' + Math.trunc(((contributions['contributions'].length - 1) - i) / 7))
      .attr('width', this.squareSize + 'px')
      .attr('height', this.squareSize + 'px')
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.5);
      })
      .on('mouseout', function (d) {
        d3.select(this).attr('opacity', 1);
      })
      .attr('fill', 'white')
      .transition().duration(700)
      .attr('fill', d => {
        return d.color;
      });
    this.readingMusic = false;
    if (this.musicTiming.length > 0) {
      this.musicTiming.forEach(timing => {
        clearTimeout(timing);
      });
    }
    d3.select('#music-stick').remove();
    this.constructMusic(contributions);
  }

  onGetMusic() {
    if (!this.readingMusic) {
      this.readingMusic = true;
      const stick = this.svg.append('rect')
        .attr('x', 0)
        .attr('id', 'music-stick')
        .attr('y', this.chartHeight * 0.1)
        .attr('width', 3)
        .attr('height', this.chartHeight * 0.8)
        .attr('fill', 'white').transition().duration(10000 * 54 / 53).ease(d3.easeLinear).attr('x', this.chartWidth);

      this.readMusic();
    }
  }

  onStopMusic() {
    this.readingMusic = false;
    if (this.musicTiming.length > 0) {
      this.musicTiming.forEach(timing => {
        clearTimeout(timing);
      });
    }
    d3.select('#music-stick').remove();
  }

  constructMusic(contributions) {
    let musicSample = [];
    this.musicSkeleton = [];
    for (let i = contributions['contributions'].length - 1; i >= 0; i--) {
      if (contributions['contributions'][i]['intensity'] > 0) {
        musicSample.push(i % 7);
      }
      if ((i + 1) % 7 === 0) {
        this.musicSkeleton.push(musicSample);
        musicSample = [];
      }
    }

    this.preLoadMusic();
  }

  preLoadMusic() {
    const audio0 = new Audio('/assets/music/s2s_dh_oneshots_harp1.mp3');
    const audio1 = new Audio('/assets/music/s2s_dh_oneshots_harp2.mp3');
    const audio2 = new Audio('/assets/music/s2s_dh_oneshots_harp3.mp3');
    const audio3 = new Audio('/assets/music/s2s_dh_oneshots_harp4.mp3');
    const audio4 = new Audio('/assets/music/s2s_dh_oneshots_harp8.mp3');
    const audio5 = new Audio('/assets/music/s2s_dh_oneshots_harp6.mp3');
    const audio6 = new Audio('/assets/music/s2s_dh_oneshots_harp7.mp3');

    this.audios = [audio0, audio1, audio2, audio3, audio4, audio5, audio6];
  }

  readMusic() {
    this.musicSkeleton.forEach((sample, index) => {
      this.musicTiming.push(setTimeout(() => {
        if (sample.length > 0) {
          sample.forEach(audio => {
            if (this.readingMusic) {
              this.audios[audio].cloneNode(true).play();
            }
          });
        }
      }, index * 10000 / 53));
    });
    setTimeout(() => {
      this.onStopMusic();
    }, ((this.musicSkeleton.length + 1) * 10000 / 53));
  }

}
