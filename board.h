#ifndef BOARD_H
#define BOARD_H

#include <cassert>
#include <iomanip>
#include <iostream>
#include <QtCore>
#include "building.h"
using namespace std;

class Tile : public QObject {
public:
    char terrain;           // Terrain Layer: mountain(X), ocean(X), blank
    char res;               // Resource Layer: arable, forest, oil
    Building* building;     // Build Layer: factory(f,o), farm(a)
    Tile(char t='.', char r='.') : terrain(t), res(r), building(nullptr) {}
    ~Tile() {if(building) delete building;}
public:
    // build a building
    void build(Building* b) {
        assert(building!=b);
        if(building) delete building;
        building=b;
    }
    // report to console
    friend ostream& operator<< (ostream& out, const Tile& t){
        if(t.terrain=='m' || t.terrain=='o')
            out<<t.terrain<<' ';
        else{
            out<<t.res;
            out<<t.building;
        }
        return out;
    }
};

class Board : public QObject {
public:
    Board(int width, int height, QString terrain, QString res){
        int length=width*height;
        assert(terrain.length()==length);
        assert(res.length()==length);
        // set data
        for(int i=0;i<length;i++){
            Tile* t=new Tile(terrain[i].toLatin1(),res[i].toLatin1());
            _board.push_back(t);
        }
    }
    ~Board(){
        for(int i=0;i<_board.length();i++)
            delete _board[i];
        _board.clear();
    }

    // map index <--> (x,y)
    int indexOf(int x, int y) const{
        return y*_width+x;
    }
    QPair<int,int> xyOf(int index) const{
        return QPair<int,int>(index%_width, index/_width);
    }

    // access a member
    Tile* at(int x, int y){
        return _board[indexOf(x,y)];
    }

    // report to console
    friend ostream& operator<< (ostream& out, const Board& b){
        //  0 1 2 3 4 5 6 7 8 9 10
        out<<"  ";
        for(int x=-1;x<b._width;x++)
            out<<setw(2)<<x;
        out<<endl;
        // the matrix
        for(int y=0;y<b._height;y++){
            out<<setw(2)<<y;
            for(int x=0;x<b._width;x++)
                out<<b._board[b.indexOf(x,y)];
            out<<endl;
        }
        return out;
    }

private:
    int _width;
    int _height;
    QVector<Tile*> _board;
};

#endif // BOARD_H
