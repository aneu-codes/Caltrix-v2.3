class MatrixCalculator {
	constructor() {
		this.matrixA = [];
		this.matrixB = [];
		for (var i = 0; i < 3; i++) {
			this.matrixA[i] = [];
			this.matrixB[i] = [];
		}

		this.AxDimension = 3;
		this.AyDimension = 3;
		this.BxDimension = 3;
		this.ByDimension = 3;
	}

	invertMatrix() {

		this.cleanBoard();
		this.calculateDeterminant();

		if (this.determinantA == null) {
			return; //Error will already be printed out by calculateDeterminant method.

		} else if (this.determinantA == 0) {
			this.printOnConsole("Matriz es no invertible.");
			return;

		} else {

			var result = [];

			for (var i = 0; i < 3; i++) {
				result[i] = [];
			}

			this.adjunctMatrix();

			//Dividing the cofactor matrix transposted by the determinant

			if (this.AxDimension != 1) {
				var steps = [];
				var step1 = [];
				var fraction = [];
				var gcf = [];
				var aux = [];
				var sim = [];

				for (var i = 0; i < this.AxDimension; i++) {
					steps[i] = [];
					step1[i] = [];
					gcf[i] = [];
					aux[i] = [];
					sim[i] = [];
					fraction[i] = [];

					for (var j = 0; j < this.AyDimension; j++) {
						result[i][j] = Math.round(this.adjunctA[i][j] / this.determinantA * 100) / 100;
						result[i][j] = (result[i][j]).toFixed(2);
						//formated
						var adj = this.adjunctA[i][j];
						var r = result[i][j];
						var adj = this.formated(adj);
						var r = this.formated(r);
						step1[i][j] = `${adj} / ${this.determinantA}`;
						gcf[i][j] = this.gcm(this.adjunctA[i][j], this.determinantA);

						if (gcf[i][j] == 0) {
							fraction[i][j] = 0;
						} else {
							//denominator for fraction
							aux[i][j] = `${gcf[i][j]}`;
							var f = gcf[i][j];
							var f = this.formated(f);
							//fraction
							sim[i][j] = `(${adj} ÷ ${f}) / (${this.determinantA} ÷ ${f})`;
							//formated
							var n = adj / f;
							var d = this.determinantA / f;
							if (d < 0) {
								var d = -d;
								var n = -n;
							}
							var n = this.formated(n);
							var d = this.formated(d);
							fraction[i][j] = `${n} / ${d}`;
						}

						steps[i][j] = `adj(A)[${i + 1}][${j + 1}] / det(A) = ${adj} / ${this.determinantA}  ->  A^-1[${i + 1}][${j + 1}] = ${step1[i][j]}`;
					}
				}
			}

			var string = "Calculando matriz inversa de A...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "Procedimiento:\r";
			string += "\tDeterminante de A divide a matriz de cofactores de A.\r";
			string += "\t\tA^-1 = adj(A)/det(A)\r";
			string += "\r";

			for (var i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + steps[i][j] + "\r";
				}
			}
			string += "\r";

			string += "Matriz A Inversa:\r";
			string += "A^-1 =" + this.matrixToString(step1) + "\r";
			string += "MCD(numerador,denominador):\r";
			string += "MCD =" + this.matrixToString(aux) + "\r";
			string += "Simplificando matriz:\r";
			string += "\r";
			string += "A^-1 =" + this.matrixToString(sim) + "\r";
			string += "A^-1 =" + this.matrixToString(fraction) + "\r";
			string += "A^-1 =" + this.matrixToString(result);

			this.printOnConsole(string);
		}

	}

	gcm(a, b) {
		if (b == 0) {
			return a;
		} else {
			return this.gcm(b, a % b);
		}
	}

	adjunctMatrix() {

		this.cleanBoard();
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en matriz A, por favor.");
			return;

		} else {

			var adjacent = [];
			var result = [];
			var aux = [];

			for (var i = 0; i < 3; i++) {
				adjacent[i] = [];
				result[i] = [];
				aux[i] = [];
			}

			//Calculating adjacency matrix
			var step1 = [];
			var stepi = [];

			for (i = 0; i < this.AyDimension; i++) {

				step1[i] = [];
				stepi[i] = [];

				for (var j = 0; j < this.AxDimension; j++) {

					//formated
					var p = (-1) ** (i + 1 + j + 1);
					var p = p == 1 ? " " + p : p;

					if (this.AxDimension == 1 && this.AyDimension == 1) {
						adjacent[i][j] = 1 + "/" + this.matrixA[i][j];

					} else if (this.AxDimension == 2 && this.AyDimension == 2) {
						//Reconstructing 2 dimension sub matrix
						adjacent[j][i] = p * this.matrixA[i][j];
						aux[i][j] = adjacent[0][0];
						adjacent[0][0] = adjacent[1][1];
						adjacent[1][1] = aux[0][0];

						if (i == 0) {
							if (j == 0) {
								//formated
								var a11 = this.matrixA[1][1];
								var a11 = this.formated(a11);

								step1[i][j] = `C[${i + 1}][${j + 1}] = (-1^(${i + 1}+${j + 1})) * M${i + 1}${j + 1} = ${p} * ${a11} = ${a11}`;
								stepi[i][j] = `${p} * ${a11}`;
							} if (j == 1) {
								//formated
								var a10 = this.matrixA[1][0];
								var a10 = this.formated(a10);
								step1[i][j] = `C[${i + 1}][${j + 1}] = (-1^(${i + 1}+${j + 1})) * M${i + 1}${j + 1} = ${p} * ${-a10} = ${-a10}`;
								stepi[i][j] = `${p} * ${-a10}`;
							}
						} else {
							//formated
							var adja = adjacent[i][j];
							var adja = this.formated(adja);
							step1[i][j] = `C[${i + 1}][${j + 1}] = (-1^(${i + 1}+${j + 1})) * M${i + 1}${j + 1} = ${p} * ${adja} = ${adja}`;
							stepi[i][j] = `${p} * ${adja}`;
						}

					} else if (this.AxDimension == 3 && this.AyDimension == 3) {  //Calculando cofactor matrix
						//Reconstructing 2 dimension sub matrix
						var count1 = 0;
						var count2 = 0;
						for (var k = 0; k < 3; k++) {
							for (var l = 0; l < 3; l++) {
								if (l != j && k != i) {
									aux[count1][count2] = this.matrixA[k][l];
									count2++;
								}
							}
							count2 = 0;
							if (k != i)
								count1++;
						}
						adjacent[i][j] = p * (aux[0][0] * aux[1][1] - aux[0][1] * aux[1][0]);
						//formated
						var c = adjacent[i][j];
						var c = this.formated(c);
						//formated
						var aux00 = aux[0][0];
						var aux01 = aux[0][1];
						var aux10 = aux[1][0];
						var aux11 = aux[1][1];
						var aux00 = this.formated(aux00);
						var aux01 = this.formated(aux01);
						var aux10 = this.formated(aux10);
						var aux11 = this.formated(aux11);
						step1[i][j] = `C[${i + 1}][${j + 1}] = [-1^(${i + 1}+${j + 1})] * det(M${i + 1}${j + 1}) = ${p} * [(${aux00} * ${aux11}) - (${aux01} * ${aux10})] \t= ${c}`;
						stepi[i][j] = `${p} * [(${aux00} * ${aux11}) - (${aux01} * ${aux10})]`;
					} else {
						this.printOnConsole("Solo se pueden adjuntar matrices cuadradas.");
						return;
					}
				}
			}

			//Transposing the cofactor matrix
			var adjunct = [];
			var step2 = [];
			for (var i = 0; i < this.AxDimension; i++) {
				adjunct[i] = [];
				step2[i] = [];
				for (var j = 0; j < this.AyDimension; j++) {
					result[i][j] = adjacent[j][i];
					adjunct[i][j] = result[i][j];
					//formated
					var a = adjacent[j][i];
					var a = this.formated(a);
					step2[i][j] = `C[${j + 1}][${i + 1}] = ${a} \t->  C^t[${j + 1}][${i + 1}] = adj(A)[${i + 1}][${j + 1}] = ${a}`;
				}
			}

			this.adjunctA = adjunct;



			var string = "Adjuntando matriz A...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "Procedimiento:\r";
			string += "\tTranspone matriz de cofactores de A\r";
			string += "\t\tadj(A) = cof(A)^t = C^t = C[j][i]\r";
			string += "\r";
			string += "\tElementos de matriz de cofactores de A\r";
			string += "\t\tC[i][j] = [-1^(i+j)] * det(Mij)\r" + "\r";

			for (var i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + step1[i][j] + "\r";
				}
			}
			string += "\r";

			string += "C =" + this.matrixToString(stepi) + "\r";
			string += "C =" + this.matrixToString(adjacent) + "\r";

			string += "\tElementos de matriz de cofactores transpuesta\r";
			string += "\t\tC[i][j] -> C^t[i][j] = adj(A)\r";
			string += "\r";

			for (var i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + step2[i][j] + "\r";
				}
			}
			string += "\r";

			string += "Matriz A adjunta:\r";
			string += "adj(A)=" + this.matrixToString(result);

			this.printOnConsole(string);
		}

	}

	transposeMatrix() {

		this.cleanBoard();
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en matriz A, por favor.");
			return;

		} else if (this.AyDimension != 0 && this.AxDimension != 0) {

			var result = [];
			var steps = [];

			if (this.AyDimension == this.AxDimension) {

				for (var i = 0; i < this.AyDimension; i++) {
					steps[i] = [];
					result[i] = [];

					for (var j = 0; j < this.AxDimension; j++) {
						result[i][j] = this.matrixA[j][i];
						var a = this.matrixA[j][i];
						var a = this.formated(a);
						steps[i][j] = `A[${j + 1}][${i + 1}] = ${a} \t->  A^t[${i + 1}][${j + 1}] = ${a}`;
					}
				}

			} else if (this.AyDimension < this.AxDimension) {

				for (var i = 0; i < this.AxDimension; i++) {
					steps[i] = [];
					result[i] = [];

					for (var j = 0; j < this.AyDimension; j++) {
						result[i][j] = this.matrixA[j][i];
						var a = this.matrixA[j][i];
						var a = this.formated(a);
						steps[i][j] = `A[${j + 1}][${i + 1}] = ${a} \t->  A^t[${i + 1}][${j + 1}] = ${a}`;
					}
				}

			} else if (this.AyDimension > this.AxDimension) {

				for (var i = 0; i < this.AyDimension; i++) {
					steps[i] = [];
					result[i] = [];

					for (var j = 0; j <= this.AxDimension; j++) {
						result[i][j] = this.matrixA[j][i];
						var a = this.matrixA[j][i];
						var a = this.formated(a);
						steps[i][j] = `A[${j + 1}][${i + 1}] = ${a} \t->  A^t[${i + 1}][${j + 1}] = ${a}`;
					}
				}
			}

			var string = "Transponiendo matriz A...\r";
			string += "\r";
			string += "Dimension de matriz A: " + this.AyDimension + "x" + this.AxDimension + "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "Procedimiento:\r";
			string += "\tIntercambio de columnas y filas.\r";
			string += "\t\tA[i][j]  ->  A^t = A[j][i]\r";
			string += "\r";

			if (this.AyDimension == this.AxDimension) {
				for (i = 0; i < this.AyDimension; i++) {
					for (var j = 0; j < this.AxDimension; j++) {
						string += "\t" + steps[i][j] + "\r";
					}
				}
			}

			string += "\r";
			string += "Matriz A transpuesta:\r";
			string += "A^t =" + this.matrixToString(result);

			this.printOnConsole(string);
		}
	}

	scalarXMatrix() {

		this.cleanBoard();

		var k = document.getElementsByClassName("k")[0];

		if (this.AyDimension == 0 && this.AxDimension == 0 || k.value === "") {
			this.printOnConsole("Inserta elementos en matriz A y escalar K, por favor.");
			return;

		} else {

			var scalar = parseFloat(k.value);

			this.rebuildMatrix();
			var result = [];
			var steps = [];
			var step1 = [];

			for (var i = 0; i < 3; i++)
				result[i] = [];

			for (i = 0; i < this.AyDimension; i++) {
				steps[i] = [];
				step1[i] = [];
				for (var j = 0; j < this.AxDimension; j++) {
					//Parsing is necessary here since addition operator can also concatenate strings
					result[i][j] = Math.round((parseFloat(this.matrixA[i][j]) * scalar * 100) / 100);
					//var e = this.matrixA[i][j];
					var a = this.matrixA[i][j];
					var r = result[i][j];
					var a = this.formated(a);
					var r = this.formated(r);
					steps[i][j] = `${scalar} * A[${i + 1}][${j + 1}] = ${scalar} * ${a} \t= ${r}`;
					step1[i][j] = `${scalar} * ${a}`;
				}
			}

			var string = "Multiplicando escalar K por matriz A...\r" + "\r";
			string += "K*A =\r";
			string += "= " + scalar + "*" + this.matrixToString(this.matrixA) + "\r";

			string += "Procedimiento:\r";
			string += "\tEscalar multiplica a cada elemento de A.\r";
			string += "\t\tK * A[i][j]\r";
			string += "\r";
			for (i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + steps[i][j] + "\r";
				}
			}

			string += "\r";
			string += "K*A =" + this.matrixToString(step1) + "\r";
			string += "Matriz A escalada por K:\r";
			string += "K*A =" + this.matrixToString(result);
			this.printOnConsole(string);
		}
	}

	subtractMatrix() {

		this.cleanBoard();
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en las matrices, por favor.");
			return;
		} else if (this.AxDimension != this.BxDimension || this.AyDimension != this.ByDimension) {
			this.printOnConsole("Solo se pueden sustraer matrices con igual dimensión.");
			return;

		} else {

			var result = [];

			for (var i = 0; i < 3; i++)
				result[i] = [];
			var steps = [];
			var step1 = [];

			for (i = 0; i < this.AyDimension; i++) {
				steps[i] = [];
				step1[i] = [];

				for (var j = 0; j < this.AxDimension; j++) {
					result[i][j] = Math.round((parseFloat(this.matrixA[i][j]) - parseFloat(this.matrixB[i][j])) * 100) / 100;
					//formated
					var a = this.matrixA[i][j];
					var b = this.matrixB[i][j];
					var r = result[i][j];
					var a = this.formated(a);
					var b = this.formated(b);
					var r = this.formated(r);
					steps[i][j] = `A[${i + 1}][${j + 1}] - B[${i + 1}][${j + 1}] = ${a} - ${b} = ${r}`
					step1[i][j] = `${a} - ${b}`
				}
			}

			var string = "Sustrayendo matriz B a matriz A...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "\r";
			string += "B =" + this.matrixToString(this.matrixB) + "\r";

			string += "Procedimiento: \r";
			string += "\tResta elementos de misma posición.\r";
			string += "\t\tA[i][j] - B[i][j]\r";
			string += "\r";
			for (i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + steps[i][j] + "\r";
				}
			}

			string += "\r";
			string += "A-B =" + this.matrixToString(step1) + "\r";
			string += "Matriz A sustraida por matriz B:\r";
			string += "A-B =" + this.matrixToString(result);
			this.printOnConsole(string);
		}
	}

	addMatrix() {
		this.cleanBoard();
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en las matrices, por favor.");
			return;

		} else if (this.AxDimension != this.BxDimension || this.AyDimension != this.ByDimension) {
			this.printOnConsole("Matrices tienen diferentes dimensiones.");
			return;

		} else {

			var result = [];
			for (var i = 0; i < 3; i++)
				result[i] = [];

			var steps = [];
			var step1 = [];

			for (i = 0; i < this.AyDimension; i++) {
				steps[i] = [];
				step1[i] = [];

				for (var j = 0; j < this.AxDimension; j++) {
					//Parsing is necessary here since addition operator can also concatenate strings
					result[i][j] = Math.round((parseFloat(this.matrixA[i][j]) + parseFloat(this.matrixB[i][j])) * 100) / 100;
					//formated
					var a = this.matrixA[i][j];
					var b = this.matrixB[i][j];
					var r = result[i][j];
					var a = this.formated(a);
					var b = this.formated(b);
					var r = this.formated(r);
					steps[i][j] = `A[${i + 1}][${j + 1}] + B[${i + 1}][${j + 1}] = ${a} + ${b} = ${r}`;
					step1[i][j] = `${a} + ${b}`;
				}
			}

			var string = "Adicionando matriz B a matriz A...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "\r";
			string += "B =" + this.matrixToString(this.matrixB) + "\r";

			string += "Procedimiento: \r";
			string += "\tSuma elementos de misma posición.\r";
			string += "\t\tA[i][j] + B[i][j]\r";
			string += "\r";
			for (i = 0; i < this.AyDimension; i++) {
				for (var j = 0; j < this.AxDimension; j++) {
					string += "\t" + steps[i][j] + "\r";
				}
			}

			string += "\r";
			string += "A+B =" + this.matrixToString(step1) + "\r";
			string += "Matriz A adicionada con matriz B:\r";
			string += "A+B =" + this.matrixToString(result);
			this.printOnConsole(string);

		}
	}

	multiplyMatrix() {
		this.cleanBoard();
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en las matrices, por favor.");
			return;

		} else if (this.AxDimension != this.ByDimension) {
			this.printOnConsole("No se pueden calcular AxB. \rEl número de columnas de la matriz A es diferente del número de filas de B.");
			return;

		} else {

			var result = [];

			for (var i = 0; i < 3; i++)
				result[i] = [];

			var steps = [];
			var step1 = [];

			var rowsRes = this.AyDimension;
			var columnsRes = this.BxDimension;

			for (i = 0; i < rowsRes; i++) {
				steps[i] = [];
				step1[i] = [];
				for (j = 0; j < columnsRes; j++) {
					var sum = 0;
					for (var k = 0; k < this.AxDimension; k++) {
						sum += this.matrixA[i][k] * this.matrixB[k][j];
					}
					result[i][j] = Math.round(sum * 100) / 100;
					var r = result[i][j];
					var r = this.formated(r);
					var ai0 = this.matrixA[i][0];
					var ai0 = this.formated(ai0);
					var b0j = this.matrixB[0][j];
					var b0j = this.formated(b0j);
					var ai1 = this.matrixA[i][1];
					var ai1 = this.formated(ai1);
					var b1j = this.matrixB[1][j];
					var b1j = this.formated(b1j);
					var ai2 = this.matrixA[i][2];
					var ai2 = this.formated(ai2);
					var b2j = this.matrixB[2][j];
					var b2j = this.formated(b2j);

					steps[i][j] = `A[${i + 1}][${0 + 1}] * B[${0 + 1}][${j + 1}] + A[${i + 1}][${1 + 1}] * B[${1 + 1}][${j + 1}] + A[${i + 1}][${2 + 1}] * B[${2 + 1}][${j + 1}]`
						+ `\r\t= ${ai0} * ${b0j} + ${ai1} * ${b1j} + ${ai2} * ${b2j} = ${r} \r`;
					step1[i][j] = `(${ai0} * ${b0j} + ${ai1} * ${b1j} + ${ai2} * ${b2j})`;
				}
			}

			var string = "Multiplicando matriz A por matriz B...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "B =" + this.matrixToString(this.matrixB) + "\r";

			string += "Procedimiento: \r";
			string += "\tFilas de A multiplicadas por columnas de B:\r";
			string += "\r";

			for (var i = 0; i < rowsRes; i++) {
				for (var j = 0; j < columnsRes; j++) {
					string += "\t" + steps[i][j] + "\r";
				}
			}

			string += "AxB =\r";
			string += this.matrixToString(step1) + "\r";
			//string += "AxB =" + this.matrixToString(step1) + "\r";
			string += "Matriz A multiplicada por matriz B:\r";
			string += "AxB=" + this.matrixToString(result);
			this.printOnConsole(string);

		}
	}

	printOnConsole(message) {
		console.log(message);
	}

	calculateDeterminant() {
		this.rebuildMatrix();

		if (this.AyDimension == 0 && this.AxDimension == 0) {
			this.printOnConsole("Inserta elementos en matriz A, por favor.");
			return;
		} else if (this.AxDimension != this.AyDimension) {
			this.determinantA = null;
			this.printOnConsole("No es una matriz cuadrada. Por ello, no se puede calcular la determinante.");
			return;

		} else {

			var determinant;
			var steps = [];

			if (this.AxDimension == 1) {
				determinant = this.matrixA[0][0];
				steps.push(`det(A) = ${determinant}`);

			} else if (this.AxDimension == 2) {
				determinant = (this.matrixA[0][0] * this.matrixA[1][1]) - (this.matrixA[0][1] * this.matrixA[1][0]);
				steps.push(`det(A) =  (A[${0 + 1}][${0 + 1}] * A[${1 + 1}][${1 + 1}]) - (A[${0 + 1}][${1 + 1}] * A[${1 + 1}][${0 + 1}]) = (${this.matrixA[0][0]} * ${this.matrixA[1][1]}) - (${this.matrixA[0][1]} * ${this.matrixA[1][0]}) = ${determinant}`);

			} else if (this.AxDimension == 3) {
				var d1, d2, d3, d4, d5, d6;
				d1 = this.matrixA[0][0] * this.matrixA[1][1] * this.matrixA[2][2];
				d2 = this.matrixA[0][1] * this.matrixA[1][2] * this.matrixA[2][0];
				d3 = this.matrixA[0][2] * this.matrixA[1][0] * this.matrixA[2][1];
				d4 = this.matrixA[0][2] * this.matrixA[1][1] * this.matrixA[2][0];
				d5 = this.matrixA[0][0] * this.matrixA[1][2] * this.matrixA[2][1];
				d6 = this.matrixA[0][1] * this.matrixA[1][0] * this.matrixA[2][2];
				determinant = Math.round((d1 + d2 + d3 - d4 - d5 - d6) * 100) / 100;
				steps.push(`Aplicando regla de Sarrus`);
				steps.push(`\tdet(A) = d1 + d2 + d3 - d4 - d5 - d6\r`);
				steps.push(`d1 = A[${0 + 1}][${0 + 1}] * A[${1 + 1}][${1 + 1}] * A[${2 + 1}][${2 + 1}] \r \td1 = ${this.matrixA[0][0]} * ${this.matrixA[1][1]} * ${this.matrixA[2][2]} = ${d1} \r`);
				steps.push(`d2 = A[${0 + 1}][${1 + 1}] * A[${1 + 1}][${2 + 1}] * A[${2 + 1}][${0 + 1}] \r \td2 = ${this.matrixA[0][1]} * ${this.matrixA[1][2]} * ${this.matrixA[2][0]} = ${d2} \r`);
				steps.push(`d3 = A[${0 + 1}][${2 + 1}] * A[${1 + 1}][${0 + 1}] * A[${2 + 1}][${1 + 1}] \r \td3 = ${this.matrixA[0][2]} * ${this.matrixA[1][0]} * ${this.matrixA[2][1]} = ${d3} \r`);
				steps.push(`d4 = A[${0 + 1}][${2 + 1}] * A[${1 + 1}][${1 + 1}] * A[${2 + 1}][${0 + 1}] \r \td4 = ${this.matrixA[0][2]} * ${this.matrixA[1][1]} * ${this.matrixA[2][0]} = ${d4} \r`);
				steps.push(`d5 = A[${0 + 1}][${0 + 1}] * A[${1 + 1}][${2 + 1}] * A[${2 + 1}][${1 + 1}] \r \td5 = ${this.matrixA[0][0]} * ${this.matrixA[1][2]} * ${this.matrixA[2][1]} = ${d5} \r`);
				steps.push(`d6 = A[${0 + 1}][${1 + 1}] * A[${1 + 1}][${0 + 1}] * A[${2 + 1}][${2 + 1}] \r \td6 = ${this.matrixA[0][1]} * ${this.matrixA[1][0]} * ${this.matrixA[2][2]} = ${d6} \r`);
				steps.push(`det(A) = ${d1} + ${d2} + ${d3} - ${d4} - ${d5} - ${d6} \r \tdet(A) = ${determinant}`);
			}

			this.determinantA = determinant;

			var string = "Calculando determinante de A...\r";
			string += "\r";
			string += "A =" + this.matrixToString(this.matrixA) + "\r";
			string += "Procedimiento\r";

			for (var i = 0; i < steps.length; i++) {
				string += "\t" + steps[i] + "\r";
			}

			string += "\rDeterminante de A: " + determinant;
			this.printOnConsole(string);
			return;
		}
	}

	formated(e) {
		if (e > -100 && e <= -10 || e >= 100 && e < 1000) {
			e = " " + e;
		} else if (e > -10 && e < 0 || e >= 10 && e < 100) {
			e = "  " + e;
		} else if (e >= 0 && e < 10) {
			e = "   " + e;
		} else {
			e;
		}
		return e;
	}

	matrixToString(matrix) {
		var string = "";
		var tab = "  ";
		for (var i = 0; i < matrix.length; i++) {
			string += "\t│ ";
			for (var j = 0; j < matrix[i].length; j++) {
				if (matrix[i][j] > -1000 && matrix[i][j] <= -100 || matrix[i][j] >= 1000 && matrix[i][j] < 10000) {
					string += tab + " " + matrix[i][j] + tab;
				} else if (matrix[i][j] > -100 && matrix[i][j] <= -10 || matrix[i][j] >= 100 && matrix[i][j] < 1000) {
					string += tab + "  " + matrix[i][j] + tab;
				} else if (matrix[i][j] > -10 && matrix[i][j] < 0 || matrix[i][j] >= 10 && matrix[i][j] < 100) {
					string += tab + "   " + matrix[i][j] + tab;
				} else if (matrix[i][j] >= 0 && matrix[i][j] < 10) {
					string += tab + "    " + matrix[i][j] + tab;
				} else {
					string += tab + matrix[i][j] + tab;
				}
			}
			string += " │\r";
		}
		return string;
	}

	cleanBoard() {
		var board = document.querySelectorAll("#console");
		board.value = "";
	}

	printOnConsole(val) {
		document.getElementById("console").value = val;
		autoResize.call(textarea);
	}

	rebuildMatrix() {
		var row1 = document.getElementsByClassName("m1r1");
		var row2 = document.getElementsByClassName("m1r2");
		var row3 = document.getElementsByClassName("m1r3");
		for (var i = 0; i < 3; i++) {
			this.matrixA[0][i] = row1[i].value;
			this.matrixA[1][i] = row2[i].value;
			this.matrixA[2][i] = row3[i].value;
		}
		row1 = document.getElementsByClassName("m2r1");
		row2 = document.getElementsByClassName("m2r2");
		row3 = document.getElementsByClassName("m2r3");
		for (var i = 0; i < 3; i++) {
			this.matrixB[0][i] = row1[i].value;
			this.matrixB[1][i] = row2[i].value;
			this.matrixB[2][i] = row3[i].value;
		}
		this.calculateDimensions();
	}

	calculateDimensions() {
		//Calculating matrix A's dimensions
		this.AyDimension = 3;
		this.AxDimension = 3;

		var count = 2;
		//If there's a whole empty column, we'll decrease the dimension and look at the next one.
		while (count >= 0 && this.matrixA[0][count] == "" && this.matrixA[1][count] == "" && this.matrixA[2][count] == "") {
			this.AxDimension--;
			count--;
		}
		count = 2;
		//If there's a whole empty row, we'll decrease the dimension and look at the next one.
		while (count >= 0 && this.matrixA[count][0] == "" && this.matrixA[count][1] == "" && this.matrixA[count][2] == "") {
			this.AyDimension--;
			count--;
		}

		//Calculating matrix B's dimensions in the same way
		this.ByDimension = 3;
		this.BxDimension = 3;

		var count = 2;
		while (count >= 0 && this.matrixB[0][count] == "" && this.matrixB[1][count] == "" && this.matrixB[2][count] == "") {
			this.BxDimension--;
			count--;
		}
		count = 2;
		while (count >= 0 && this.matrixB[count][0] == "" && this.matrixB[count][1] == "" && this.matrixB[count][2] == "") {
			this.ByDimension--;
			count--;
		}
	}
}

var mc = new MatrixCalculator();