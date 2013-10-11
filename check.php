<?php 


$image = imagecreatefromjpeg("dag.jpg");

$imgsz = getimagesize("dag.jpg");

$width = $imgsz[0];
$height = $imgsz[1];
$w = (int)($width/3);
$h = (int)($height/3);

echo "var exporto = '[{\"w\":$w, \"h\":$h},";
for($i = 0; $i < $width; $i+=3)

	for($j = 0 ;$j < $height; $j+=3)
	{
		$rgb = imagecolorat($image, $i, $j);
		$r = ($rgb >> 16) & 0xFF;
		$g = ($rgb >> 8) & 0xFF;
		$b = $rgb & 0xFF;
		$y = (float)((0.3*$r)+(0.59*$g)+(0.11*$b));
		$rgb = dechex($rgb);
		echo "{\"c\":\"0x$rgb\", \"d\":\"$y\"},";
	}
echo ']\';';
?>