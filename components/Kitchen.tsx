
import React, { useState, useEffect, useRef } from 'react';
import { Ingredient, ItemState, StationType, KitchenProps } from '../types';
import { DISHES, ICONS, CUSTOMER_AVATARS, MAX_INVENTORY } from '../constants';

const Kitchen: React.FC<KitchenProps> = ({ level, onQuit, onWin, theme }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.duration);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [stationStates, setStationStates] = useState<Record<string, any>>({
    PREP: { item: null, progress: 0 },
    STOVE: { item: null, progress: 0 },
    PLATING: { items: [] as Ingredient[] },
  });

  const timerRef = useRef<any>(null);
  const spawnRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });

      setCustomers((prev) => 
        prev.map(c => ({ 
          ...c, 
          order: { ...c.order, timeLeft: c.order.timeLeft - 1 } 
        })).filter(c => c.order.timeLeft > 0)
      );
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Check for win condition separately to avoid re-running timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      onWin(score);
    }
  }, [timeLeft, score, onWin]);

  useEffect(() => {
    spawnRef.current = setInterval(() => {
      setCustomers((prev) => {
        if (prev.length < 3) {
          const randomDish = DISHES[Math.floor(Math.random() * DISHES.length)];
          const newCust = {
            id: Math.random().toString(36).substr(2, 9),
            order: {
              id: Math.random().toString(),
              dishName: randomDish.name,
              ingredients: randomDish.ingredients,
              timeLeft: 30,
              maxTime: 30,
              reward: randomDish.baseReward,
            },
            positionX: prev.length * 200 + 100,
            appearance: CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)],
          };
          return [...prev, newCust];
        }
        return prev;
      });
    }, 5000);
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, []);

  const addToInventory = (ing: Ingredient) => {
    if (inventory.length < MAX_INVENTORY) {
      setInventory(prev => [...prev, ing]);
    }
  };

  const removeFromInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const spawnIngredient = (name: string) => {
    if (inventory.length < MAX_INVENTORY) {
      addToInventory({
        id: Math.random().toString(),
        name,
        state: ItemState.RAW,
        icon: (ICONS as any)[name] || '❓',
      });
    }
  };

  const interactStation = (type: string) => {
    const current = stationStates[type];

    if (type === StationType.PREP) {
      if (!current.item && inventory.length > 0) {
        const prepItem = inventory[0];
        if (prepItem.state === ItemState.RAW) {
          setStationStates((prev: any) => ({
            ...prev,
            PREP: { item: prepItem, progress: 0 }
          }));
          removeFromInventory(prepItem.id);
        }
      } else if (current.item) {
        if (current.progress < 100) {
          setStationStates((prev: any) => ({
            ...prev,
            PREP: { ...prev.PREP, progress: prev.PREP.progress + 34 }
          }));
        } else {
          addToInventory({ ...current.item, state: ItemState.PREPPED });
          setStationStates((prev: any) => ({ ...prev, PREP: { item: null, progress: 0 } }));
        }
      }
    }

    if (type === StationType.STOVE) {
      if (!current.item && inventory.length > 0) {
        const stoveItem = inventory[0];
        if (stoveItem.state === ItemState.PREPPED) {
          setStationStates((prev: any) => ({
            ...prev,
            STOVE: { item: stoveItem, progress: 0 }
          }));
          removeFromInventory(stoveItem.id);
          setTimeout(() => {
            setStationStates((prev: any) => {
              if (prev.STOVE.item && prev.STOVE.item.id === stoveItem.id) {
                return { ...prev, STOVE: { ...prev.STOVE, progress: 100 } };
              }
              return prev;
            });
          }, 1500);
        }
      } else if (current.item && current.progress >= 100) {
        addToInventory({ ...current.item, state: ItemState.COOKED });
        setStationStates((prev: any) => ({ ...prev, STOVE: { item: null, progress: 0 } }));
      }
    }

    if (type === StationType.PLATING) {
      if (inventory.length > 0) {
        const plateItem = inventory[0];
        setStationStates((prev: any) => ({
          ...prev,
          PLATING: { items: [...prev.PLATING.items, plateItem] }
        }));
        removeFromInventory(plateItem.id);
      } else if (current.items.length > 0) {
        const platedDish = current.items;
        const matchingCustomer = customers.find(c => 
          c.order.ingredients.every((ing: string) => 
            platedDish.some((p: any) => p.name === ing && p.state === ItemState.COOKED)
          )
        );

        if (matchingCustomer) {
          setScore(prev => prev + matchingCustomer.order.reward);
          setCustomers((prev: any[]) => prev.filter(c => c.id !== matchingCustomer.id));
          setStationStates((prev: any) => ({ ...prev, PLATING: { items: [] } }));
        }
      }
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: theme ? `url(${theme})` : `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920&blur=5')` }}
      >
        {!theme && <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>}
      </div>

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
        <div className="flex flex-col">
          <button onClick={onQuit} className="text-white/50 hover:text-white mb-2 uppercase text-xs font-bold tracking-widest flex items-center gap-2">
            <span>✖</span> ABORT MISSION
          </button>
          <div className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-xl cyber-border">
            <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Sector Status</h3>
            <div className="flex items-center gap-8 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase">Score</span>
                <span className="mono text-3xl font-bold">{score}</span>
              </div>
              <div className="w-[1px] h-10 bg-slate-800"></div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase">Time</span>
                <span className={`mono text-3xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {Array.from({ length: MAX_INVENTORY }).map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-xl bg-slate-900/80 cyber-border flex items-center justify-center relative overflow-hidden">
              {inventory[i] ? (
                <div className="flex flex-col items-center">
                  <span className="text-4xl">{inventory[i].icon}</span>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold mt-1">{inventory[i].state}</span>
                </div>
              ) : (
                <span className="text-slate-700 text-xs font-bold">EMPTY</span>
              )}
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500 rounded-br"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-[30%] left-0 w-full h-1/4 z-20 flex justify-center items-end">
        <div className="w-full max-w-5xl h-10 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-white/20 relative shadow-2xl">
          {customers.map((c: any) => (
            <div 
              key={c.id} 
              className="absolute bottom-0 flex flex-col items-center transition-all duration-500"
              style={{ left: c.positionX }}
            >
              <div className="relative mb-4 group">
                <div className="absolute -top-16 bg-white rounded-2xl p-3 text-slate-900 shadow-xl min-w-[120px]">
                  <p className="text-[10px] font-bold uppercase text-slate-400 leading-tight">I Want</p>
                  <p className="font-bold text-sm">{c.order.dishName}</p>
                  <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all duration-1000" 
                      style={{ width: `${(c.order.timeLeft / c.order.maxTime) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <img src={c.appearance} className="w-20 h-20 rounded-full border-4 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]" alt="customer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-900/40 backdrop-blur-sm z-10 border-t border-white/10 p-12">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-4 gap-8">
          <div className="col-span-1 grid grid-cols-2 gap-4">
            {Object.keys(ICONS).map((name) => (
              <button
                key={name}
                onClick={() => spawnIngredient(name)}
                className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{(ICONS as any)[name]}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">{name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => interactStation(StationType.PREP)}
            className="bg-slate-800/80 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 flex flex-col items-center justify-center gap-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
            <span className="text-xs font-black tracking-widest text-cyan-400">01 PREP UNIT</span>
            <div className="text-5xl">🔪</div>
            {stationStates.PREP.item && (
              <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all" style={{ width: `${stationStates.PREP.progress}%` }}></div>
              </div>
            )}
            {stationStates.PREP.item && <span className="text-white font-bold">{stationStates.PREP.item.icon}</span>}
          </button>

          <button 
            onClick={() => interactStation(StationType.STOVE)}
            className="bg-slate-800/80 rounded-2xl border-2 border-dashed border-orange-500/30 hover:border-orange-400 flex flex-col items-center justify-center gap-4 relative group"
          >
             <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
            <span className="text-xs font-black tracking-widest text-orange-400">02 THERMAL CORE</span>
            <div className="text-5xl">🔥</div>
            {stationStates.STOVE.item && (
              <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all" style={{ width: `${stationStates.STOVE.progress}%` }}></div>
              </div>
            )}
            {stationStates.STOVE.item && <span className="text-white font-bold">{stationStates.STOVE.item.icon}</span>}
          </button>

          <button 
            onClick={() => interactStation(StationType.PLATING)}
            className="bg-slate-800/80 rounded-2xl border-2 border-dashed border-purple-500/30 hover:border-purple-400 flex flex-col items-center justify-center gap-4 relative group"
          >
            <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
            <span className="text-xs font-black tracking-widest text-purple-400">03 ASSEMBLY</span>
            <div className="text-5xl">🍽️</div>
            <div className="flex gap-1 flex-wrap justify-center p-2">
              {stationStates.PLATING.items.map((it: Ingredient) => (
                <span key={it.id} className="text-xl">{it.icon}</span>
              ))}
            </div>
            {stationStates.PLATING.items.length > 0 && <span className="text-[10px] uppercase text-purple-400 animate-pulse font-bold">Tap to Serve</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
