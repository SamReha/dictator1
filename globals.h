#ifndef GLOBALS_H
#define GLOBALS_H

#include <QtCore>

/** Singleton class for Global variants **/
/** This class does not have a .cpp file **/

class Globals : public QObject{
    // ------------------ Singleton Func -----------------------
    Q_DISABLE_COPY(B2Config)
public:
    static Globals& singleton(){
        static Global* _singleton;
        if(_singleton==nullptr) _singleton=new Globals;
        return _singleton;
    }
    Globals() {
        // TODO - setup the init keys & vars - Jake
    }
    bool has(QString key){
        return _vars.contains(key);
    }
    void set(QString key, QVariant value){
        assert(_vars.contains(key));
        _vars[key]=value;
    }
    QVariant get(QString key){
        return _vars[key];
    }
    void turnUpdate(){
        // TODO - update _vars by turn - Jake
    }
private:
    QMap<QString, QVariant> _vars;
};

#endif // GLOBALS_H
