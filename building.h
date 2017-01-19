#ifndef BUILDING_H
#define BUILDING_H

#include <QtCore>

/** Abstract class for all types of buildings **/

class Building : public QObject {
public:
    char type;
    QString name;
    int level;              // TBD
    QPair<int,int> pos;
};

#endif // BUILDING_H
