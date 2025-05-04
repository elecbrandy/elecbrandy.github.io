+++
title = '[42seoul] fdf'
date = 2024-04-09
featured_image = "https://i.imgur.com/VmsQmlo.png"
tags = ['C', '42seoul']
+++

{{<series title="🪐 /42seoul" series="42seoul">}}

<br>

## 1. 소개
____

> Wireframe model

42서울 본과정 입과 후 여섯번째로 수행한 과제로, minilibx라는 간단한 그래픽 라이브러리를 통해 2차원 평면에 3차원 구조를 띄우는 것이 핵심이다.

즉, 아래와 같이 map이 주어지면

<img src="https://i.imgur.com/RsJuA4d.png" width="600">


이렇게 3차원에 투영한다. 주어진 맵은 하나의 2차원 배열이고, 배열 하나당 값은 z좌표를 의미한다.

<img src="https://i.imgur.com/bN92eir.png" width="600">

<br>
<br>

## 2. fdf 명세서
____
- **Program name**
	- `fdf`
- **Arguments**
	- `A file in format *.fdf`: 지정된 서식자 형태의 파일 (`.fdf`)
- **DESCRIPTION**
    - **Mandatory part**
    	- 인풋으로 들어온 맵을 3차원에 와이어 프레임 형식으로 투영한다.
	- **External functs**
		- open, close, read, write, malloc, free, perror, strerror, exit
		- All functions of the math library (-lm compiler option, man man 3 math)
		- All functions of the MiniLibX
		- ft_printf and any equivalent YOU coded

<br>
<br>


## 3. 개념 정리
____

### 3-1. Isometric projection
우리는 어떻게 2차원의 정보를 가공해 3차원처럼 보이게 할 수 있을까? 이때 사용하는 것이 **Isometric projection** 이다. 3D 물체를 2D 평면(종이, 화면)에 그릴 때, 길이와 각도를 최대한 왜곡 없이 보여주려고 하는 방법이다. 쉽게 말하면, "3D처럼 보이게 그리는 특별한 방법" 인 것이다!

이 Isometric projection으로 표현된 시점은 우리에게 아주 익숙하다. 마치 탑뷰 시점에서 살짝 기울어진, 리그오브레전드나 리니지, 스타크래프트 등등 어디선가 많이 봤던 각도 임에 분명하다.
그리는 비법은, 3D의 세 축 x, y, x가 서로 120도씩 벌어져 보이게 그리는 것이다. 평면에서의 한 바퀴는 360, 이것을 공평하게 3등분 한것이다.

자세하고 쉬운 정리는 놀랍게도 아래 위키백과에 잘 나와있다.
- https://en.wikipedia.org/wiki/Isometric_projection

<br>

### 3-2. dot
컴퓨터 화면은 결국 작은 점들의 집합이 모여 각각의 색으로 빛나고 있는 모양새이다. 그렇다면, 우리가 저 평면에 그림을 그리기 위해서는 어떤 정보가 필요할까? 우선 모든 점들은 모니터 어딘가를 중심 (0, 0)으로 두고, 중심으로부터 얼마나 떨어져있는지 xy 좌표를 가지고 있을 것 이다. 그리고 map 데이터에 따른 각각의 z좌표를 가지고 있을 것이다. 또한 해당 점이 어떤 색인지 RGB 값도 가지고 있을 것이다.  

이러한 점들이 1자로 모이면 선, 선이 모이면 면이 그려지는 것이다. 그렇다면 어느 정도 함수를 어떻게 구성해야할지 느낌이 오는 것 같다. 우선 점을 찍고, 그 다음 점들을 모아 선을 만들고... 반복!

<br>
<br>

## 4. Mandatory
____

### 4.1 struct

``` c
typedef struct s_dot
{
	int				x;
	int				y;
	int				z;
	unsigned int	color;
}	t_dot;

typedef struct s_line
{
	int		dx;
	int		dy;
	int		sx;
	int		sy;
	int		err;
}	t_line;

typedef struct s_map
{
	char	*file;
	int		max_x;
	int		min_x;
	int		max_y;
	int		min_y;
	int		max_z;
	int		min_z;
	int		col_len;
	int		row_len;
	t_dot	**coord;
}	t_map;

```

위와 같은 구조체 등을 사용했다. 각각의 점, 선 그리고 맵 데이터가 가지고 있는 정보를 담을 구조체이다. 이제 여러 함수들은 이 구조체를 인자로 받아서 특정 지점에 뭔가 표시할 것이다.

### 4-2. main

``` c
int	main(int ac, char **av)
{
	t_map	map;
	t_img	img;

	if (ac == 1)
		ft_print_error("no arguments");
	if (ac > 2)
		ft_print_error("too many arguments");
	init_struct(&map, &img, av);
	if (check_map_size(&map) == 0 || check_map_form(&map) == 0)
		ft_print_error("invalid map file.");
	if (alloc_map(&map) == 0 || parse_map(&map) == 0)
		ft_print_error("failed to parse map file");
	set_img_size(&img, &map);
	init_mlx(&img, &map);
	draw_img(&map, &img);
	ft_map_free(map.coord, map.row_len);
	exe_mlx_event(&img);
	return (0);
}
```

맵을 파싱받으며 맵 크기, 맵의 형태 등에서 이상이 없는지 확인한다. 이상이 없다면 맵의 크기만큼 동적할당을 받고 정보를 채워넣는다. 이후 위 정보들을 토대로 minilibx 라이브러리의 기능을 사용해 창을 띄우고 창에 그림을 그린다. 그림을 한번 그렸다면 free를 통해 자원을 정리한다.

minilibx 사용법은 42 슬랙이나 구글에 검색하면 각각의 함수 사용법이 상세히 나와있으므로 참고하면 좋을 듯 하다. 누군가 한번 정리한 것을 또 다시 정리할 필요는 없어보인다.

- https://harm-smits.github.io/42docs/libs/minilibx

`test_map`들을 보면 크기가 엄청 큰 것들이 있는데, 그 크기를 어떻게 조절할 것인지 고민이 필요해보인다. 그냥 창을 넘어가는 그래픽은 짤리게 둘 것인가? 또는 창 크기, 모니터 크기에 따라 어느 정도 상한선 하한선을 두고 그래픽 크기를 조절할 것인가? 잘 고민해보자. 평가자에게 논리를 잘 설명해봅시다!

<br>
<br>

## 5. Reference
_____
- https://en.wikipedia.org/wiki/Isometric_projection
- https://harm-smits.github.io/42docs/libs/minilibx
- https://love-every-moment.tistory.com/62

<br>
<br>
