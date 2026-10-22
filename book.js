import * as THREE from "./vendor/three/build/three.module.js";
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // HTML中已注释，如需启用请取消注释

export const book = {
    // ===================== 【长安三万里·朱雀大街双时空】单场景 =====================
    "two": {
        "name_": "长安城西",
        "weather": "sunny",
        // "ani": true,
        "ani": {
            "typeSpeed": 250,
            // 核心文本（你指定的完整内容）
            "pageContent": [
                "同年的长安城西，三十岁的储光羲进士及第已十年，官拜监察御史，身居要职.心怀江南故里的储光羲，虽生归隐之心，却仍坚守直言进谏的为官之责."
            ],

            "vid": {
                p0: "3dmod_and_pic/pic/vd/1.3.mp4"   
            }
            },
        "obj_man": {     
            "p0": {
                "func": function() {
                    // 1. 创建1000x1000的超大地面
                    const geo = new THREE.PlaneGeometry(300, 300, 20, 20), pos = geo.attributes.position;
                    const colorAttr = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
                    const warmColor = new THREE.Color(0xa67c52);
                    const coldColor = new THREE.Color(0x5a6474);

                    // 2. 双时空地形逻辑（范围同步放大8.33倍，适配1000尺寸）
                    for(let i = 0; i < pos.count; i++) {
                        const x = pos.getX(i), y = pos.getY(i);
                        let z = 0;
                        if(x > 0) {
                            z = (Math.random() - 0.5) * 0.2;
                            if(Math.sqrt(x * x + y * y) < 167) z *= 0.05; // 20 * (1000/120) ≈ 167
                        } else {
                            z = (Math.random() - 0.5) * 0.8;
                            if(Math.sqrt(x * x + y * y) < 167) z *= 0.3;
                        }
                        pos.setZ(i, z);

                        const mixFactor = Math.max(0, Math.min(1, (-x + 500) / 1000)); // 60→500，120→1000
                        const finalColor = warmColor.clone().lerp(coldColor, mixFactor);
                        colorAttr.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
                    }
                    pos.needsUpdate = true;
                    geo.setAttribute('color', colorAttr);
                    geo.computeVertexNormals();

                    // 3. 加载循环石头路贴图（请在此处填入你的图片地址）
                    const textureLoader = new THREE.TextureLoader();
                    const stoneTexture = textureLoader.load('3dmod_and_pic/pic/grey_zhuankuai.jpg');
                    stoneTexture.wrapS = THREE.RepeatWrapping;
                    stoneTexture.wrapT = THREE.RepeatWrapping;
                    stoneTexture.repeat.set(50, 50); // 控制纹理重复密度，数值越大砖块越小

                    const mat = new THREE.MeshStandardMaterial({
                        map: stoneTexture,          // 启用石头路贴图
                        vertexColors: true,         // 保留顶点色实现双时空色调混合
                        side: THREE.DoubleSide,
                        roughness: 0.95,
                        metalness: 0
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.rotation.x = -Math.PI / 2;
                    return mesh;
                },
                "set_": [0, 0, 0],
                "color": 0xa67c52
            },

            "p1": {
                "func": function() {
                    // --- 1. 创建半球几何体 ---
                    const radius = 150; // 半球半径（直径1000，与原平面尺寸匹配）
                    const geo = new THREE.SphereGeometry(
                            radius,          // 半径
                            64,              // 水平分段数
                            64,              // 垂直分段数
                            0,               // 水平方向：一圈 360°
                            Math.PI * 2,     // 水平完整圆周
                            0,               // 垂直起始角度：从顶部（北极点）开始
                            Math.PI / 2      // 垂直角度：只向下画 90° → 形成**上半球**
                        );
                        

                    // --- 2. 加载纹理（替换为你的地面纹理路径） ---
                    const textureLoader = new THREE.TextureLoader();
                    const floorTexture = textureLoader.load('3dmod_and_pic/pic/t1.jpg'); 
                    floorTexture.repeat.set(1, 1); // 纹理不重复，直接铺满

                    // 可选：如果纹理显示颠倒，可打开下面这行注释
                    // floorTexture.flipY = false; 

                    // --- 3. 创建材质 ---
                    const mat = new THREE.MeshStandardMaterial({
                        map: floorTexture,
                        side: THREE.DoubleSide, // 双面渲染（防止从下方看不到地面）
                        roughness: 0.5,
                        metalness: 0
                    });

                    // --- 4. 创建网格并设置位置 ---
                    const mesh = new THREE.Mesh(geo, mat);
                    // 球心设置在 (0, 500, 0)，这样半球的“底部”（南极点）刚好在 y=0 平面
                    mesh.position.set(0, -radius*2, 0); 
                    mesh.rotation.y = Math.PI / 2;
                    return mesh;
                },
                "set_": [0, 0, 0], // 对应 mesh.position
                // "color": 0xffffff
            }, 

            "chuguangxi_kaiyuan": {
                "name": "储光羲",
                "text_":'你是30岁的储光羲，开元二十四年春，你进士及第已十年，官至监察御史，刚从皇城归来，在宅中槐树下煮茶，收到江南友人的来信满心思乡，却也深知身为谏官的职责，决意留在长安。请你以此时储光羲的身份、沉稳持重的语气回复，贴合剧本内容，可引用《长安道》诗作。回复的内容需要在50字以内',
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/Green_Robe_Taoist_Sag_biped_Animation_Walking_withSkin.glb"
                },
                "initialState": "idle",
                "stateActions": {
                    "idle": {
                        "path": "3dmod_and_pic/mod/Green_Robe_Taoist_Sag_biped_Animation_Walking_withSkin.glb",
                        "loop": false,
                        "position":[0,0,-25],
                        "rotation": [0, Math.PI/2, 0],
                        "scale": [10,10,10],
                        "visible": true
                    },
                    "recite": {
                        "path": "3dmod_and_pic/mod/Green_Robe_Taoist_Sag_biped_Animation_Walking_withSkin.glb",
                        "loop": true,
                        "position":[0,0,-25],
                        "rotation": [0, 0, 0],
                        "scale": [10,10,10],
                        "visible": true
                    },
                    "walk": {
                        "path": "3dmod_and_pic/mod/Green_Robe_Taoist_Sag_biped_Animation_Walking_withSkin.glb",
                        "loop": true,
                        "position": [0,0,-25],
                        "rotation": [0, 0, 0],
                        "scale": [10,10,10],
                        "visible": true
                    },
                    "hide": {
                        "path": null,
                        "loop": false,
                        "position":[0,0,-25],
                        "rotation": [0, 0, 0],
                        "scale": [10,10,10],
                        "visible": false
                    }
                },

                "dialogue_": {
                    "root": {
                        "text": "清静巷内，几株老槐浓荫蔽日。刚从皇城归来的官员解下青色官服，在石桌旁煮茶。石桌上摊着江南寄来的信，信笺旁画着太湖鲈鱼、扬州月色。他指尖摩挲信笺，望着院中飘落的槐花，久久不语。院墙外传来坊门闭合的鼓声，一声比一声远。",
                        "options": [
                            {
                                "label": "大人在此望槐思乡？",
                                "goTo": "node_homesick",
                                "setState": "idle"
                            },
                            {
                                "label": "听闻大人收到江南来信？",
                                "goTo": "node_letter",
                                "setState": "idle"
                            },
                            {
                                "label": "大人对长安道有何感怀？",
                                "goTo": "node_poem",
                                "setState": "recite"
                            },
                            {
                                "label": "大人为何不辞官归乡？",
                                "goTo": "node_duty",
                                "setState": "walk"
                            },
                            {
                                "label": "大人可羡辋川之隐？",
                                "goTo": "node_wangchuan",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_homesick": {
                        "text": "让阁下见笑了。信是江南旧友陆三寄的。他说太湖的鲈鱼又肥了，扬州的月色还是那样白；橘子熟时，满湖都是甜的。我离开江南十一年，春风吹落槐花，忽然就想不起自家门前的石阶是什么模样。人一老，记性先记着吃食。",
                        "options": [
                            {
                                "label": "江南风物，确实令人神往。",
                                "goTo": "node_letter"
                            },
                            {
                                "label": "大人为何不辞官归乡？",
                                "goTo": "node_duty",
                                "setState": "walk"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_letter": {
                        "text": "陆三与我在江南同窗，他性子散，一生不肯入仕，只在湖边种橘。信中夹了一片橘叶，说替我留了一坛酒。他又说，江南的雨还是那样细，落一夜也不响。我回信说，待我老病归乡，便去喝他这坛酒。他说好，酒埋在后院第三棵橘树下，等我。橘叶已经干透了，我还是留着。",
                        "options": [
                            {
                                "label": "大人可曾想过赴约？",
                                "goTo": "node_poem",
                                "setState": "recite"
                            },
                            {
                                "label": "大人为何不辞官归乡？",
                                "goTo": "node_duty",
                                "setState": "walk"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_poem": {
                        "text": "近日偶感长安繁华与虚妄，作了一首《长安道》。\n鸣鞭过酒肆，袨服游倡门。\n百万一时尽，含情无片言。\n西行一千里，暝色生寒树。\n暗闻歌吹声，知是长安路。",
                        "options": [
                            {
                                "label": "诗句道尽长安的繁华与虚妄。",
                                "goTo": "node_duty",
                                "setState": "walk"
                            },
                            {
                                "label": "末二句，像是在说我。",
                                "goTo": "node_choice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_duty": {
                        "text": "我苦读半生，才居监察御史之位。此官不必日日面圣，却要风闻奏事：百官有过，民有冤屈，都要说话。前日我上一疏，至今未见回音。如今张九龄公已罢相，李林甫当权，朝堂上人人低眉，更需有人开口。思乡是私心，进谏是公事。",
                        "options": [
                            {
                                "label": "大人这是以公掩私么？",
                                "goTo": "node_zhang",
                                "setState": "idle"
                            },
                            {
                                "label": "当年初入长安，是何光景？",
                                "goTo": "node_early",
                                "setState": "walk"
                            },
                            {
                                "label": "听说大人留意一个少年？",
                                "goTo": "node_censen",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_zhang": {
                        "text": "张公罢相那日，我在皇城外站了半日，看他的车马出城，无人相送。李林甫为相，朝堂上从此只闻一人之言；他的门客，如今都换了姓李的。阁下问我怕不怕——怕。可我是御史，御史的胆子不该是自己的，是这身官服借的。",
                        "options": [
                            {
                                "label": "大人既怕，为何还要说话？",
                                "goTo": "node_choice",
                                "setState": "idle"
                            },
                            {
                                "label": "大人夜里也说这些话么？",
                                "goTo": "node_night",
                                "setState": "walk"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_early": {
                        "text": "开元十四年，我二十岁，自江南入长安应试。那时只觉长安大得不像人间：坊门一开，车马如江河；夜里禁街，鼓声如雷。我住城南一间小屋，冬天冷得握不住笔，就呵气写。后来及第，才敢抬头看朱雀大街的柳。",
                        "options": [
                            {
                                "label": "大人如今还看柳么？",
                                "goTo": "node_zhang",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_wangchuan": {
                        "text": "邻院便是王摩诘的旧宅，他在辋川有别业，半官半隐，诗画自娱。我羡慕他，却不学他。他退得起，我退不起；他山水是归处，我山水只是梦里。他信中附了一幅辋川图，我看了一夜。一个人若只为自己活，山水处处是家。",
                        "options": [
                            {
                                "label": "大人羡慕，为何不学？",
                                "goTo": "node_choice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_censen": {
                        "text": "东市旅舍住着个少年书生，姓岑，南阳人，诗写得有筋骨，却屡投不中。前日在巷口遇见，他向我行礼，我问他读何书。他说读《史记》，游天下。我忽然想起当年的自己。我把自己的旧诗抄了一份，塞给他，也不知他看没看。这长安城，最不缺的就是这样的少年。",
                        "options": [
                            {
                                "label": "大人可曾提点过他？",
                                "goTo": "node_choice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_night": {
                        "text": "夜里值宿御史台，灯油是公家的，我却不敢多点。案上堆着奏疏，一份关于漕运，一份关于边军。写到一半，忽听得宫城里更鼓响，才知已是三更。我搁笔，看灯花爆了一下，想起江南的夜，安静得听得见鱼跃。",
                        "options": [
                            {
                                "label": "大人写了什么？",
                                "goTo": "node_choice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_choice": {
                        "text": "隐还是仕？我在江上问过自己千百回。夜里梦见江南的橘子熟了，醒来听见长安的鼓。后来想通了：隐是要有去处的人才能隐。我若此时归乡，不过是逃；待到该说的话都说完，该尽的力都尽到，再回去喝那坛酒，才叫归。",
                        "options": [
                            {
                                "label": "大人高义，令人敬佩。",
                                "goTo": "node_end",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_leave": {
                        "text": "阁下慢走，我也要整衣往皇城去了。",
                        "options": [],
                        "closeOnEnd": true
                    },
                    "node_end": {
                        "text": "阁下还有何事，不妨直言。",
                        "showInput": true
                    }
                }
            },
            
            "wangwei": {
                "name": "王维",
                "text_": "你是王维，字摩诘，年过五十，半官半隐，常居辋川别业，与城西储御史相善。你诗画兼擅，深于佛理，语气清淡含蓄，不喜争辩。请你以王维的身份回答来客，可引自己的诗句，须准确，回复在五十字以内。",
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/王维52岁(1).glb"
                },
                "initialState": "idle",
                "stateActions": {
                    "idle": {
                        "path": "3dmod_and_pic/mod/王维52岁(1).glb",
                        "loop": false,
                        "position": [-4, 0, -23],
                        "rotation": [0, Math.PI/2, 0],
                        "scale": [10, 10, 10],
                        "visible": true
                    }
                },
                "dialogue_": {
                    "root": {
                        "text": "槐院深处，一位青衫中年人倚竹而立，指间没有茶，只有一片落叶。他知道身后有人来，也不回头，只看着墙头的一缕光。风过，竹影在他衣上动，像画上未干的墨。竹外有小径，通向后院。",
                        "options": [
                            {
                                "label": "先生在看什么？",
                                "goTo": "node_shi",
                                "setState": "idle"
                            },
                            {
                                "label": "先生也住在这槐院？",
                                "goTo": "node_wangchuan",
                                "setState": "idle"
                            },
                            {
                                "label": "听闻先生与储御史相熟？",
                                "goTo": "node_chuguangxi",
                                "setState": "idle"
                            },
                            {
                                "label": "先生近来可有新作？",
                                "goTo": "node_yun",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_shi": {
                        "text": "看光。你看这墙，早上的光从东边来，竹影压在墙上，一重一重，深浅不同；到午后，影就短了。诗里有画，不是说诗里写得出画，是说写诗的人先在心里看见那幅画。明月松间照，清泉石上流——若看不见，便写不出。画也一样，一笔落定，气就定了。你看那树，光移一寸，影便移一寸。",
                        "options": [
                            {
                                "label": "先生说得，请再指一二。",
                                "goTo": "node_advice",
                                "setState": "idle"
                            },
                            {
                                "label": "先生也作画么？",
                                "goTo": "node_wangchuan",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_wangchuan": {
                        "text": "辋川离城不远，有一处旧宅，几亩山田，一条辋水。我在朝中领一份闲职，得空便去住上几日。朝堂上人人争着往前站，我便往后站一步。可这一步，也不是人人都退得起。退，要退得心安；心不安，山林里也是闹市。",
                        "options": [
                            {
                                "label": "先生退得起，是福气。",
                                "goTo": "node_chuguangxi",
                                "setState": "idle"
                            },
                            {
                                "label": "朝堂与辋川，先生更爱哪个？",
                                "goTo": "node_advice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_chuguangxi": {
                        "text": "城西那位储御史，我认识。他在朝里说话，我在辋川看山，旁人看我们是两条路，其实是一条：他守着该守的，我放着该放的。他来信说想归乡，我回他四个字：且住为佳。他若肯退，我替他高兴。山长在，水长流，人先要把手里的事做完。",
                        "options": [
                            {
                                "label": "先生说得是。",
                                "goTo": "node_advice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_yun": {
                        "text": "有。近年我最得意的两句，是行到水穷处，坐看云起时。人在世上，走到没有路的地方，才看得见云。你若有心，便记着：路是走出来的，云是等出来的；你若不明白，便去看看水。",
                        "options": [
                            {
                                "label": "路是走出来的，云是等出来的。",
                                "goTo": "node_advice",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_advice": {
                        "text": "后生，我有一句话送你：不必急着成名。长安城里的名字，风一吹就散了；留在诗里的，才留得久。你看那空山：不见人，但闻人语响。人走后，声音还在；声音散后，青苔上还有光。写诗做人，都急不得。诗成之后，先给自己看，再给山水看。字要慢，心要静。",
                        "options": [
                            {
                                "label": "谨记先生之言。",
                                "goTo": "node_end",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_leave": {
                        "text": "去吧。山门不锁，有缘再来。",
                        "options": [],
                        "closeOnEnd": true
                    },
                    "node_end": {
                        "text": "你还有话，慢慢说。",
                        "showInput": true
                    }
                }
            },

            "春明门": {
                "name": "春明门",
                "set_": [10,30, 10],
                "size_": [45, 60, 40],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chunmingmen.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我是守春明门的老门吏。辰时开钥，戌时闭门。看赶考的书生进城，也看贬官的车马出城。门籍一翻，人便有了来处与去处；翻不到的，便在门洞里等。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "站得久了，便知长安的来去，都在这把钥匙里。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },
            "茶几": {
                "name": "茶几",
                "set_": [0, 3, -50],
                "size_": [10,10,10],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/teaset.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这只黑漆茶几，原摆在主人家槐树下。茶是越州来的，水是井里新汲的。江南的信笺压在案角，茶烟一过，纸便软了。主人煮茶时不爱说话，只看着热气往上走。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "茶凉了可以再煮；人走了，这院子便空了一半。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }},
            "长安西市酒肆": {
                "name": "长安西市酒肆",
                "set_": [-50, 15, -50],
                "size_": [25,25,25],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/xishi_bar.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "西市这家酒肆，胡姬当垆，酒旗三丈。三勒浆最烈，葡萄酒最贵；书生们喝的，总是最便宜的浊酒。醉了便拍案，醒了便付钱，谁也不问谁从何处来。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "醉话没人记得，偏有人把醉话写成了诗，贴在壁上。",
                        "options": [],
                        "closeOnEnd": true
                    }
                },

                },
            "高楼": {
                "name": "高楼",
                "set_": [60, 50, -80],
                "size_": [40, 50, 40],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/gaolou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这楼临着东市口，二层挑出一角飞檐。登楼的人爱凭栏，看市声如潮水，在脚下流过去。檐角挂铃，风一来便响，像是替这满城人说了句闲话。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "楼高不遮眼，只遮住了归路；望得越远，越想家。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            }},
"one": {
        "name_": "长安三万里·朱雀大街",
        "weather": "sunny",
        // "ani": true,
        "ani": {
            "typeSpeed": 250,
            // 核心文本（你指定的完整内容）
            "pageContent": [
                "开元二十四年（736年）",
                "二十岁的岑参怀揣诗赋，初入长安，出身没落的南阳岑氏，希望通过献书求仕,读书人可将诗赋投入锦匣中，如果足够出色，有机会呈到天子案前.",

            ],

            "vid": {
                p0: "3dmod_and_pic/pic/vd/1.1.mp4",  // 第一页视频
                p1: "3dmod_and_pic/pic/vd/1.2.mp4",  // 第二页视频

            }
        },
        
        
        "obj_man": {
            "p0": {
                "func": function() {
                    // 1. 创建1000x1000的超大地面
                    const geo = new THREE.PlaneGeometry(3000, 3000, 200, 200), pos = geo.attributes.position;
                    const colorAttr = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
                    const warmColor = new THREE.Color(0xa67c52);
                    const coldColor = new THREE.Color(0x5a6474);

                    // 2. 双时空地形逻辑（范围同步放大8.33倍，适配1000尺寸）
                    for(let i = 0; i < pos.count; i++) {
                        const x = pos.getX(i), y = pos.getY(i);
                        let z = 0;
                        if(x > 0) {
                            z = (Math.random() - 0.5) * 0.2;
                            if(Math.sqrt(x * x + y * y) < 167) z *= 0.05; // 20 * (1000/120) ≈ 167
                        } else {
                            z = (Math.random() - 0.5) * 0.8;
                            if(Math.sqrt(x * x + y * y) < 167) z *= 0.3;
                        }
                        pos.setZ(i, z);

                        const mixFactor = Math.max(0, Math.min(1, (-x + 500) / 1000)); // 60→500，120→1000
                        const finalColor = warmColor.clone().lerp(coldColor, mixFactor);
                        colorAttr.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
                    }
                    pos.needsUpdate = true;
                    geo.setAttribute('color', colorAttr);
                    geo.computeVertexNormals();

                    // 3. 加载循环石头路贴图（请在此处填入你的图片地址）
                    const textureLoader = new THREE.TextureLoader();
                    const stoneTexture = textureLoader.load('3dmod_and_pic/pic/grey_zhuankuai.jpg');
                    stoneTexture.wrapS = THREE.RepeatWrapping;
                    stoneTexture.wrapT = THREE.RepeatWrapping;
                    stoneTexture.repeat.set(50, 50); // 控制纹理重复密度，数值越大砖块越小

                    const mat = new THREE.MeshStandardMaterial({
                        map: stoneTexture,          // 启用石头路贴图
                        vertexColors: true,         // 保留顶点色实现双时空色调混合
                        side: THREE.DoubleSide,
                        roughness: 0.95,
                        metalness: 0
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.rotation.x = -Math.PI / 2;
                    return mesh;
                },
                "set_": [0, 0, 0],
                "color": 0xa67c52
            },

            "p1": {
                "func": function() {
                    // --- 1. 创建半球几何体 ---
                    const radius = 1500; // 半球半径（直径1000，与原平面尺寸匹配）
                    const geo = new THREE.SphereGeometry(
                            radius,          // 半径
                            64,              // 水平分段数
                            64,              // 垂直分段数
                            0,               // 水平方向：一圈 360°
                            Math.PI * 2,     // 水平完整圆周
                            0,               // 垂直起始角度：从顶部（北极点）开始
                            Math.PI / 2      // 垂直角度：只向下画 90° → 形成**上半球**
                        );
                        

                    // --- 2. 加载纹理（替换为你的地面纹理路径） ---
                    const textureLoader = new THREE.TextureLoader();
                    const floorTexture = textureLoader.load('3dmod_and_pic/pic/t1.jpg'); 
                    floorTexture.repeat.set(1, 1); // 纹理不重复，直接铺满

                    // 可选：如果纹理显示颠倒，可打开下面这行注释
                    // floorTexture.flipY = false; 

                    // --- 3. 创建材质 ---
                    const mat = new THREE.MeshStandardMaterial({
                        map: floorTexture,
                        side: THREE.DoubleSide, // 双面渲染（防止从下方看不到地面）
                        roughness: 0.5,
                        metalness: 0
                    });

                    // --- 4. 创建网格并设置位置 ---
                    const mesh = new THREE.Mesh(geo, mat);
                    // 球心设置在 (0, 500, 0)，这样半球的“底部”（南极点）刚好在 y=0 平面
                    mesh.position.set(0, -radius*2, 0); 
                    mesh.rotation.y = Math.PI / 2;
                    return mesh;
                },
                "set_": [0, 0, 0], // 对应 mesh.position
                // "color": 0xffffff
            },


            "censen": {
            "name": "岑参",
            "text_": "你是20岁的岑参，开元二十四年春，你刚从嵩山来到长安，四次献书公卿均被退回，出身没落的南阳岑氏，满怀少年意气却屡遭失意，正站在旅舍临窗案前，决定出游河朔、待日后再入长安。请你以此时岑参的身份、少年失意却心怀壮志的语气回复，贴合剧本内容，可引用自己的诗作。下面我会向你提出几个问题，以你的身份回答我，回答的内容不要超过30字",
            "path": {
                "kind": "glb",
                "path_": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb"
            },
            "initialState": "idle",
            "stateActions": {
                "idle": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_depressed": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_contemplate": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_look_out": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_fiddle_scroll": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_sigh": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "idle_hold_poem": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "sit_arms_crossed": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Sit_on_Chair_Arms_Crossed_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "sit_floor_read": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Sit_on_Chair_Arms_Crossed_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "recite": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Sit_on_Chair_Arms_Crossed_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, 0, 0],
                    "scale": [0,3.2,-20],
                    "visible": true
                },
                "arise_ambition": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": false,
                    "position": [0,3.2,-20],
                    "rotation": [0, 0, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true,
                    "crossfade": 0.5
                },
                "listening": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, 0, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "walk": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                    // 注释：角色从初始站立位置向画面右侧行走，对应出游前整理行装、迈步出发的动作
                },
                "run": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": true,
                    "position": [0,3.2,-20],
                    "rotation": [0, Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                    // 注释：角色从行走位置继续向画面右侧奔跑，对应少年意气风发、奔赴山河的动作
                },
                "sit_back": {
                    "path": "3dmod_and_pic/mod/censen_20sui_biped_Animation_Idle_withSkin.glb",
                    "loop": false,
                    "position": [0,3.2,-20],
                    "rotation": [0, -Math.PI/2, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": true
                },
                "hide": {
                    "path": null,
                    "loop": false,
                    "position": [0,3.2,-20],
                    "rotation": [0, 0, 0],
                    "scale": [13.2, 13.2, 13.2],
                    "visible": false
                }
            },
            "dialogue_": {
                "root": {
                    "text": "临窗案前，素袍少年紧锁眉头。案头书策堆叠，昨夜春雨打湿了诗稿，砚中墨痕未干。他指间捏着一卷被退回四次的诗，抬眼望窗外杨柳，终是轻轻一叹。窗外春明门的车马声隐隐传来。案角还压着半块冷胡饼。",
                    "options": [
                        {
                            "label": "公子为何在此长叹？",
                            "goTo": "node_sigh",
                            "setState": "idle_depressed"
                        },
                        {
                            "label": "案头诗稿，可否一读？",
                            "goTo": "node_poem",
                            "setState": "recite"
                        },
                        {
                            "label": "听闻公子出自南阳岑氏？",
                            "goTo": "node_family",
                            "setState": "sit_arms_crossed"
                        },
                        {
                            "label": "嵩山十年，公子如何度过？",
                            "goTo": "node_songshan",
                            "setState": "sit_floor_read"
                        },
                        {
                            "label": "公子可曾投过锦匣？",
                            "goTo": "node_jinxia",
                            "setState": "idle_fiddle_scroll"
                        },
                        {
                            "label": "这长安城坊，公子可熟？",
                            "goTo": "node_fangshi",
                            "setState": "idle_look_out"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_sigh": {
                    "text": "我在嵩山苦读十年，怀一囊诗赋入长安，原想献书公卿，寻一条仕途。诗稿四次被退回，方知长安米贵，居大不易。夜里投宿，五文钱只租一张席子；白日访人，公卿的门房比门楼还高。长安的米价，比嵩山的松子贵出十倍；长安的门槛，比首阳的山路还高。伯夷在首阳，欲往无轻舟。",
                    "options": [
                        {
                            "label": "长安米贵，公子如何过活？",
                            "goTo": "node_letter"
                        },
                        {
                            "label": "诗中伯夷，是何用意？",
                            "goTo": "node_poem_feeling"
                        },
                        {
                            "label": "公子年少，何愁无知己？",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_family": {
                    "text": "南阳岑氏，百年间出过三位宰相。开元元年，伯父岑羲卷入朝中之事获罪，全族受牵连。父亲早逝，我在嵩山脚下苦读十年，才敢踏入这长安门。父亲临终只留一句话：岑家的书，不能断。门楣虽旧，字还在；我姓岑，便要替这姓氏再走一程。",
                    "options": [
                        {
                            "label": "既已没落，为何还要苦读？",
                            "goTo": "node_songshan",
                            "setState": "sit_floor_read"
                        },
                        {
                            "label": "家中如今还有何人？",
                            "goTo": "node_letter",
                            "setState": "idle_fiddle_scroll"
                        },
                        {
                            "label": "门楣旧字，公子还认得么？",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_songshan": {
                    "text": "嵩山十年，清苦也安稳。父亲走后，我隐居嵩阳，每日伴松风读书，临帖写诗。冬日砚水结冰，便呵气化开；夏夜蚊多，便把脚浸在溪水里。山下的樵夫不识得字，却常送我一担柴；寺里的老僧说我面相苦，我说正好。寺钟一响便是一日，十年，也不过听了几千声钟。只盼一身才学，能换一纸功名。",
                    "options": [
                        {
                            "label": "十年诗稿，都投往何处？",
                            "goTo": "node_jinxia",
                            "setState": "idle_hold_poem"
                        },
                        {
                            "label": "既入长安，为何又要走？",
                            "goTo": "node_heshuo",
                            "setState": "idle_contemplate"
                        },
                        {
                            "label": "嵩山所作，可有存稿？",
                            "goTo": "node_poem",
                            "setState": "recite"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_poem": {
                    "text": "让阁下见笑了。这是我离乡时写的，题作《东归晚次潼关怀古》。写它时我十九岁，如今二十。\n暮春别乡树，晚景低津楼。\n伯夷在首阳，欲往无轻舟。\n遂登关城望，下见洪河流。\n自从巨灵开，流血千万秋。\n行行潘生赋，赫赫曹公谋。\n川上多往事，凄凉满空洲。",
                    "options": [
                        {
                            "label": "这诗写于何时？",
                            "goTo": "node_poem_feeling",
                            "setState": "idle_hold_poem"
                        },
                        {
                            "label": "诗中可见风骨。",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_poem_feeling": {
                    "text": "写诗那日，我立在潼关城头，看黄河自北而来，想起伯夷叔齐，也想起自己。归乡无轻舟，入仕无门路，两头都是岸，两头都靠不上。可关城下洪流滚滚，又觉天地极大，不该困在一处。便写下这十二句，替自己立个誓。后来想，人若没有这一口气，诗便只剩字。",
                    "options": [
                        {
                            "label": "公子终有去处。",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "既登关城，可曾想见河朔？",
                            "goTo": "node_heshuo",
                            "setState": "walk"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_jinxia": {
                    "text": "投过。东市西市之间，有几处锦匣，读书人把诗卷投进去，若得上官青眼，或有呈到天子案前的机缘。我投了三回，匣口吞得下纸，吞不下一个寒士的名字。守匣的小吏见我面熟，只摆手，说郎君且回。锦匣有锁，锁的从来是上面的人心，不是下面的纸。",
                    "options": [
                        {
                            "label": "听闻城西有位王摩诘？",
                            "goTo": "node_wangwei",
                            "setState": "idle_contemplate"
                        },
                        {
                            "label": "投书不成，家书却到了？",
                            "goTo": "node_letter",
                            "setState": "idle_sigh"
                        },
                        {
                            "label": "匣中投的，可是那首诗？",
                            "goTo": "node_poem",
                            "setState": "recite"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_letter": {
                    "text": "家中来信，是母亲托人捎的。信上只说米价又涨，让我不必省；又说院里那株老槐开花了。信纸边上有一处油渍，想是母亲就着灯写的。我读到槐花二字，忽然想起长安的槐花，今年也开了，只是无人与我同看。我回信只写一句：儿在此甚好，勿念。",
                    "options": [
                        {
                            "label": "读了家书，公子欲往何处？",
                            "goTo": "node_heshuo",
                            "setState": "walk"
                        },
                        {
                            "label": "旅舍之中，可曾遇人？",
                            "goTo": "node_hushang",
                            "setState": "idle_contemplate"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_fangshi": {
                    "text": "长安城一百零八坊，东西两市。坊有坊墙，市有市门。晨鼓三百下，市门开；暮鼓八百下，坊门闭。东市卖的是四方货，西市卖的是胡货；两市的鼓声不同，一听便知。我住的旅舍在东市边上，夜里听鼓声一层层传过来，像有人在数这城的年岁。坊门一闭，万灯同亮，也是好看。",
                    "options": [
                        {
                            "label": "坊间可曾见过胡商？",
                            "goTo": "node_hushang",
                            "setState": "idle_look_out"
                        },
                        {
                            "label": "看罢长安，公子何往？",
                            "goTo": "node_heshuo",
                            "setState": "walk"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_heshuo": {
                    "text": "我决意出游河朔。先渡黄河，看孟门山；再北上雁门，看塞草与烽燧；听说幽州多侠少年，能骑快马，饮大酒。过代州，我要去看李牧的旧垒；过幽州，我要去看塞门外的草。我要把这些都写进诗里。今日长安不留我，我便去看更大的长安：万里山河。待归来，我的诗里自有风骨。",
                    "options": [
                        {
                            "label": "临行前，可还有牵挂？",
                            "goTo": "node_wangwei",
                            "setState": "idle_contemplate"
                        },
                        {
                            "label": "此去路上，可有人同行？",
                            "goTo": "node_hushang",
                            "setState": "idle_hold_poem"
                        },
                        {
                            "label": "何时再回长安？",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_wangwei": {
                    "text": "城西槐院那位王维王摩诘，听说半官半隐，常往辋川去。我未敢去拜。他的诗如画，我的诗如刀；他看山是山，我看山是路。我只读过他两句：明月松间照，清泉石上流。临行之前，倒想去叩一次门，又怕他看我的诗，说我太急切。",
                    "options": [
                        {
                            "label": "公子何不去叩一次门？",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_hushang": {
                    "text": "朱雀大街上遇过一个胡商，牵两匹驼，说得一口汉话。他说他自碎叶来，走了八个月，驼铃一响，便知离长安近了。他问我：你也是来长安觅衣食的？我笑说，我是个读书人。他说，一样，都是把命押在路上的人。他给了我一小块香，说是安息来的；我把香收在书箧里，至今没舍得点。",
                    "options": [
                        {
                            "label": "胡商之言，公子记住了？",
                            "goTo": "node_ambition",
                            "setState": "arise_ambition"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_ambition": {
                    "text": "阁下问我既已失意，为何还肯再走。诗是人心，读诗要知其人、论其世。我此刻的失意，写进诗里，便是开元二十四年一个没落书生的长安。后人读我的诗，若能读出这一层，我便不算白来一回。大丈夫当立功异域，安能久事笔砚间。我二十岁，输得起。",
                    "options": [
                        {
                            "label": "公子保重，静候佳音。",
                            "goTo": "node_end",
                            "setState": "listening"
                        },
                        {
                            "label": "告辞了",
                            "goTo": "node_leave",
                            "setState": "idle"
                        }
                    ]
                },
                "node_leave": {
                    "text": "青山不改，绿水长流，阁下慢走。",
                    "options": [],
                    "closeOnEnd": true
                },
                "node_end": {
                    "text": "阁下还有话，不妨直言。岑某知无不言。",
                    "showInput": true
                }
            }
        },

            "hushang": {
                "name": "胡商",
                "text_": "你是康姓粟特胡商，自碎叶城沿丝路来到长安，贩丝绸、香料、玉石，汉话说得流利。你见多识广，性情爽朗，说话直白，带着商人的打量。请你以这个胡商的身份回答来客，回答简短，在五十字以内。",
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/hushang_biped_Animation_Walking_withSkin.glb"
                },
                "initialState": "idle",
                "stateActions": {
                    "idle": {
                        "path": "3dmod_and_pic/mod/hushang_biped_Animation_Walking_withSkin.glb",
                        "loop": true,
                        "position": [6, 3.2, -16],
                        "rotation": [0, -Math.PI/2, 0],
                        "scale": [13.2, 13.2, 13.2],
                        "visible": true
                    }
                },
                "dialogue_": {
                    "root": {
                        "text": "朱雀大街上，一个高鼻深目的胡商牵着两匹骆驼，货包上系着红绳。骆驼跪下前腿，货包一歪，露出半匹红锦。他看见你，先笑了，用一口汉话招呼：郎君，看货么？我这里有于阗的玉、碎叶的香。驼铃在风里响。",
                        "options": [
                            {
                                "label": "你从何处来？",
                                "goTo": "node_road",
                                "setState": "idle"
                            },
                            {
                                "label": "长安城，你走得惯么？",
                                "goTo": "node_changan",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_road": {
                        "text": "我姓康，粟特人，从碎叶城来，走了八个月。过葱岭，风大得能把人吹下崖；过戈壁，白天烫脚，夜里冻手。认路不靠眼，靠驼铃和烽燧：前头有烽火，说明有兵；有兵，就有水。在凉州换过一匹驼，那匹驼认路，我认它。雪山在左，沙海在右，人小得像一粒石子。驼铃一响，我便知道还活着。",
                        "options": [
                            {
                                "label": "八个月，值么？",
                                "goTo": "node_changan",
                                "setState": "idle"
                            },
                            {
                                "label": "在你眼里，诗人和商人一样么？",
                                "goTo": "node_poet",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_changan": {
                        "text": "长安好。西市里什么话都听得见：突厥话、吐蕃话、波斯话，还有我们粟特话。做买卖不问出身，只问货色；官府验过，收了税，就让你卖。西市有酒，胡饼新熟，五文钱能饱一日。市上还有卖胡琴的，会弹我们家乡的调子；我不识几个字，可我会算账。我这样的人，走遍天下，只有在这里能说：这是长安，也是我的长安。",
                        "options": [
                            {
                                "label": "那你为何不回去？",
                                "goTo": "node_poet",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_poet": {
                        "text": "诗人与商人，一样。你们拿命换一样东西：换一个名字，我换一驮货。名字换不来饭吃，货也带不进棺材。可人活着，总得拿点什么去换。我见过一个书生，在西市口站了三日，只为等一个识货的人。我呢，也等；等到了，再做一笔。货卖完了，人还得往前赶。",
                        "options": [
                            {
                                "label": "愿你等到。",
                                "goTo": "node_end",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_leave": {
                        "text": "郎君慢走。货还在，人也在。",
                        "options": [],
                        "closeOnEnd": true
                    },
                    "node_end": {
                        "text": "郎君还有话，问便是。",
                        "showInput": true
                    }
                }
            },

            "maihua": {
                "name": "卖花女",
                "text_": "你是长安坊间卖花的女子，荆钗布裙，每日在坊墙下卖杏花、牡丹，嘴快手勤，见惯城中春事。你识字不多，却从酒肆曲子里学得两句诗。请你以卖花女的身份回答来客，语气爽利，回答简短，在四十字以内。",
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/nvpinmin_biped_Animation_Walking_withSkin.glb"
                },
                "initialState": "idle",
                "stateActions": {
                    "idle": {
                        "path": "3dmod_and_pic/mod/nvpinmin_biped_Animation_Walking_withSkin.glb",
                        "loop": true,
                        "position": [-6, 3.2, -16],
                        "rotation": [0, -Math.PI/2, 0],
                        "scale": [13.2, 13.2, 13.2],
                        "visible": true
                    }
                },
                "dialogue_": {
                    "root": {
                        "text": "坊墙下，一个荆钗布裙的姑娘守着两只竹篮，篮里是带露的杏花，也有几枝早开的牡丹。篮边搁着一只旧铜壶，壶里还插着两三枝，花瓣上挂着水。她袖口沾着花粉，说话时手指轻轻敲着篮沿。她见你驻足，只低头抿嘴笑：郎君买花么？一枝两文，插瓶能开三日。",
                        "options": [
                            {
                                "label": "长安人怎么过春天？",
                                "goTo": "node_spring",
                                "setState": "idle"
                            },
                            {
                                "label": "你篮里这花，叫什么？",
                                "goTo": "node_flower",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_spring": {
                        "text": "长安的春天，是从曲江边开始的。三月三，士女都出城，车马挤得走不动。曲江边上摆宴，看花马，斗花，谁家的花开得好，满城都去看；船上挂彩，酒旗一路排到水边，连卖胡饼的也跟去了。我这样的，就在坊墙下卖花；花市一散，春天就过去了。我不去曲江，人多，花反倒踩坏了，只在城墙根下听听热闹。花不进城，城里的春天就短一半。",
                        "options": [
                            {
                                "label": "你也去看过曲江宴么？",
                                "goTo": "node_flower",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_flower": {
                        "text": "这是杏花，那是牡丹。牡丹贵，我一天只带三枝，卖与西市绸缎铺的娘子。我不识字，可会背两句诗，是听酒肆里的曲子学的：暗闻歌吹声，知是长安路。去年上元听来的，唱的人走了，调子还记得。我娘说，会念诗的人不必卖花；我说，那更得卖。郎君别笑，我只觉得这两句，唱的就是我们这样的日子。",
                        "options": [
                            {
                                "label": "唱得真好。",
                                "goTo": "node_end",
                                "setState": "idle"
                            },
                            {
                                "label": "告辞了",
                                "goTo": "node_leave",
                                "setState": "idle"
                            }
                        ]
                    },
                    "node_leave": {
                        "text": "郎君慢走，花卖完了我也回去。明日还在。",
                        "options": [],
                        "closeOnEnd": true
                    },
                    "node_end": {
                        "text": "郎君要一枝么？不要也看看，不碍的。",
                        "showInput": true
                    }
                }
            },

            "gate": {
                "name": "过街门楼",
                "set_": [0,150,(400-800*(10/13))],
                "size_": [200, 270-80, 100-50],
                "scale": [100.0, 100.0, 100.0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/gate.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我是市门前的老吏。晨鼓三百下，市门开；暮鼓八百下，市门闭。一日两回，我便把这人间的热闹开合两回。门洞里风最凉，进来的人带着一身尘土，出去的人带着一袖市声。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "门开时人人往里挤，门闭时个个往外走。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },
        
            "ta": {
                "name": "塔",
               "set_": [-200, 145, (60-800*(10/13))],
                "size_": [90, 150, 90],
                "scale": [36.0+20, 36.0+20, 36.0+20],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/tower.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这塔立在东市东南，砖色苍青，风铎挂在檐角。僧人每日扫塔，扫的不是尘，是塔影。塔影从西边挪到东边，一日便过完了；香客的愿，一层一层码在塔里，搬不动。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "塔影移一寸，日头便过一时；移一丈，人便老一岁。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },
            
            "一个灯笼商铺": {
                "name": "一个灯笼商铺",
                "set_": [-200, 50, -430.7692],
                "size_": [90, 54, 90],
                "rotation": [0, Math.PI/2, 0],
                "scale": [56, 56, 56],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/onestore.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这家灯笼铺只一间门面，竹篾、灯纸、细麻绳堆到梁上。老灯匠手上都是细口子，糊纸时却稳得很，一盏兔子灯，只消半日。他说灯亮不亮，看的不是纸，是骨架扎得直不直。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "灯是给夜行人看的；他这辈子，还没为自己点过一盏。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "许多灯笼商铺": {
                "name": "许多灯笼商铺",
                "set_": [-500, 51, -430.7692],
                "size_": [90, 54, 90],
                "scale": [56, 56, 56],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/manylantern.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "东市这半条街，灯笼铺挨着开。上元前后，灯纸涨了三成价，孩子们攥着两文钱，能挑半个时辰。铺子里挂满灯，白日里不点，也像是有一屋子的光在等天黑。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "满街的灯，一夜点尽，第二天照样要早起扎新的。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },
            "许多灯笼商铺2": {
                "name": "许多灯笼商铺",
                "set_": [-200, 51, -430.7692],
                "size_": [90, 54, 90],
                "scale": [56, 56, 56],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/manylantern.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "隔壁这家灯铺只扎莲花灯，花色比别家细。掌柜的娘子描花瓣，一笔一笔，描到眼花。她说莲花灯卖与书生，图个‘出淤泥’的口彩，价钱可以少收两文。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "灯亮起来的时候，描花的人反倒看不清自己的花。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "二楼1": {
                "name": "二层小楼",
                "set_": [-200, 93, -761.5385],
                "size_": [150, 100, 90],
                "scale": [56, 100, 56],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/er ceng xiao lou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这二层小楼，楼下是铺面，楼上住人。窗子临街，晾着半干的衣裳，也晾着看街上行人的眼睛。楼梯窄，货包和人都挤着上，楼板一响，楼下便知道来了客。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "楼上的人看市，市里的人从不抬头。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "二楼2": {
                "name": "二层小楼1",
                "set_": [200, 93, -761.5385],
                "size_": [150, 100, 90],
                "scale": [56, 100, 56],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/er ceng xiao lou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这楼上是间酒楼雅座，壁上题诗，墨色新旧相叠。题诗的人多半没留下姓名；留下姓名的，多半不曾在此题过诗。酒保擦壁时最小心，擦重了要挨骂。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "壁上的字每年重刷一次，刷不掉的，是那口气。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "许多灯笼和门商铺": {
                "name": "许多灯笼和门商铺",
                "set_": [200, 95, -430],
                "size_": [150, 100, 90],
                "scale": [56, 100, 56],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/manylantern.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这家铺子天不亮就卸门板，一块一块靠墙立好。掌柜的扫阶、洒水、摆货，等头一拨客人。门板一卸，这铺子才算醒；街上的声音，也是从卸门板的响动里多起来的。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "卸下的门板靠墙站着，像还没睡醒的一排人。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "许多灯笼和门商铺2": {
                "name": "许多灯笼和门商铺2",
                "set_": [500, 95, -761.5385],
                "size_": [150, 100, 90],
                "scale": [56, 100, 56],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/manylantern.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "暮鼓响过，各家上门板，一块一块扣好。案上算盘还在响，伙计们就着灶火吃夜饭。一日赚的，多不过几文，少也够吃。掌柜的把钱串子压在枕下，说睡得着比赚得多要紧。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "门板一扣，街就暗了；灯是从铺子的缝里漏出来的。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "长安东市": {
                "name": "长安东市",
                "set_": [500, 30, -430.7692],
                "size_": [90, 54, 90],
                "scale": [56, 56, 56],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/model_of_a_Tang_Dy_0408092056_texture.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我是东市市署的小吏，管秤、管斗、管伪劣。日中击鼓开市，四方货都往这二百二十行里挤：南方的茶，北方的皮，西域的香。秤平了，买卖才长久。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "人心平了，秤才叫人信；秤若不准，市就散了。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "东市旅舍": {
                "name": "东市旅舍",
                "set_": [-500, 40, -853.8462],
                "size_": [90, 54, 90],
                "scale": [56, 56, 56],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/tangdaichangandongshilin_0406081313_texture.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这间邸店住着三教九流，脚钱按月算，也可按日。柜台上有簿子，写着来客姓名、来处、去处。马槽在后院，夜里总有马铃响，不知是哪一队人又到了。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "簿子上的名字一年一换；只有掌柜的，十年没挪过地方。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "东市酒肆": {
                "name": "东市酒肆",
                "set_": [-500, 20, -400],
                "size_": [72, 36, 54],
                "scale": [36, 36, 36],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/er ceng xiao lou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这间酒肆挂青旗，旗上写新丰酒。胡姬在垆边拍坛，一坛能倒十角。书生、脚夫、行商挤在一处，说话却都压着嗓子，怕隔桌坐着熟人。谁喝得最凶，谁就最想家。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "这话是垆边说的；酒旗一收，谁也不必认谁。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },           

            "城墙门1": {
                "name": "城墙门1",
                "set_": [0, 200, -1000],
                "size_": [300, 210, 150],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang gate.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我守东面的城门。门下查验门籍，出城要验，入城更要验。开门的鼓声一响，我这一日就算起了；闭门的钲声一响，才算交差。门洞里的风最凉，来去的人都带着故事。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "从这道门进出的人，一茬接一茬，门吏只认籍，不认人。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "城墙门2": {
                "name": "城墙门2",
                "set_": [880, 200, 0],
                "size_": [300, 210, 150],
                "rotation": [0, -Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang gate.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这道门有瓮城，车辙在石板上压出深沟。税吏在门边支着案，驼队进了门洞，货包一包包看过，抽了分，才放行。守门的卒子认得每一匹驼的铃铛声。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "车辙一年年磨深；走的人，换了一茬又一茬。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "城墙门3": {
                "name": "城墙门3",
                "set_": [-880, 200, 0],
                "size_": [300, 210, 150],
                "rotation": [0, -Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang gate.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "西门到东门，我守过三处。夜里闭门落锁，钥匙挂在腰上，一圈一圈巡。有人叩门，先问一句：何处来的？答得含糊的，便让他在门洞里等天亮。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "长安睡得沉，是有人在门后醒着。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "城墙11": {
                "name": "城墙11",
                "set_": [500, 27, -1000],
                "size_": [450, 150, 75],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang1.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我是这截夯土墙。版筑时一层土一层夯，土里和着石灰。雨水在墙上冲出道道沟，箭孔是早年留下的，如今只落进风与尘。修补的民夫，比墙上的砖还换得勤。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "修墙的人换了几代；墙根下的草，比人记得事多。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "城墙12": {
                "name": "城墙12",
                "set_": [-500, 27, -1000],
                "size_": [450, 150, 75],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang1.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这是女墙，一人来高，垛口齐胸。卒子靠在这里看城外，也看天上的云。城下的驿路一直伸到天边，偶尔有驿马跑过，扬起一线黄尘，久久不散。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "守卒数过很多次烽火；数得最清的，是换岗的鼓。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },           

            "城墙21": {
                "name": "城墙21",
                "set_": [-880, 27, -584],
                "size_": [450, 150, 75],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang1.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "墙根下有几畦菜，是守卒自家开垦的。妻儿住在墙外坊里，一年见不上几回。换防的信，比家书先到；信上只有日子，没有话。他便把日子折起来，塞进腰带。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "菜畦绿了又黄；城墙没老，人老了。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },


            "城墙31": {
                "name": "城墙31",
                "set_": [880, 27, -584],
                "size_": [450, 150, 75],
                "rotation": [0, Math.PI/2, 0],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/chengqiang1.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "这里是马面，凸出城墙一段，好放箭。平日只有风。更夫夜里走过，击柝两下，过一段再击两下。他认得墙上的每道裂缝，像认自己的掌纹。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "马面上望得见城门灯火；望不见的，是城门里的人。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },



            "角楼1": {
                "name": "角楼1",
                "set_": [-880, 120, -1000],
                "size_": [100, 170, 50],
                "scale": [100, 100, 100],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/jiao lou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "我是戍卒，守这角楼。每逢换岗，便觉身子是别人的，腿是石头做的。更鼓从城里传到城角，正好敲第三下。楼上风大，说话听不清，只能看口型。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "换岗的兄弟来了，先递我一碗热水，再接过我的枪。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },

            "角楼2": {
                "name": "角楼2",
                "set_": [880, 120, -1000],
                "size_": [100, 170, 50],
                "scale": [100, 100, 100],
                "path": {
                    "kind": "glb",
                    "path_": "3dmod_and_pic/mod/jiao lou.glb"
                },
                "dialogue_": {
                    "root": {
                        "text": "角楼悬一面旗，白日悬，夜里也悬。烽燧相望，一处举火，一路传到长安。我这一生只举过一次烽：那夜雨大，烽火点不着，人人都在等一个消息。",
                        "options": [
                            {
                                "label": "知道了",
                                "goTo": "node_end"
                            }
                        ]
                    },
                    "node_end": {
                        "text": "城里一夜没睡，我一夜没敢回头。",
                        "options": [],
                        "closeOnEnd": true
                    }
                }
            },


        }
    },

    // ===================== 完整演示场景 =====================

};

// 【剧本内容补充注释】
// 1. 剧本中提及的骆驼铃声、叫卖声、琵琶声、窃窃私语等背景音效，需在HTML中通过AudioLoader单独加载配置，当前代码仅包含3D场景逻辑
// 2. 剧本中旅舍、官宅、行馆的内部细节场景，暂无对应模型素材，已通过外部建筑模型还原，内部细节可后续补充定制模型
// 3. 剧本中提及的坊墙、排水沟、柳树槐树等场景细节，已通过程序化地面和建筑模型还原，可后续补充独立植被模型丰富场景